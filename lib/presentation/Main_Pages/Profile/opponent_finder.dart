import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:player/core/config/constants.dart';

class OpponentFinderScreen extends StatefulWidget {
  const OpponentFinderScreen({super.key});

  @override
  State<OpponentFinderScreen> createState() => _OpponentFinderScreenState();
}

class _OpponentFinderScreenState extends State<OpponentFinderScreen> {
  List<OpponentRequest> pendingRequests = [];
  List<OpponentRequest> matchedRequests = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchOpponentRequests();
  }

  Future<void> fetchOpponentRequests() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final userId = prefs.getString('user_id');
      if (userId == null) throw Exception("User ID not found");

      final response = await http.get(
        Uri.parse('${AppConfig.baseUrl}/api/opponent/user/$userId'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> all = data['requests'];

        setState(() {
          pendingRequests = all
              .where((r) => r['status'] == 'pending')
              .map((r) => OpponentRequest(
                    opponentName: r['matchedWith'] ?? "Waiting",
                    requestTime: DateFormat('yMMMd').format(DateTime.parse(r['createdAt'])),
                    status: RequestStatus.pending,
                  ))
              .toList();

          matchedRequests = all
              .where((r) => r['status'] == 'matched')
              .map((r) => OpponentRequest(
                    opponentName: r['matchedWith'] ?? "Unknown",
                    requestTime: DateFormat('yMMMd').format(DateTime.parse(r['createdAt'])),
                    status: RequestStatus.matched,
                  ))
              .toList();

          isLoading = false;
        });
      } else {
        throw Exception("Failed to fetch data");
      }
    } catch (e) {
      print("Error fetching requests: $e");
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Opponent Finder'),
        backgroundColor: Colors.green,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (pendingRequests.isNotEmpty) ...[
                    const SectionTitle(title: 'Pending Requests'),
                    const SizedBox(height: 8),
                    ...pendingRequests.map((req) => OpponentCard(request: req)),
                  ],
                  if (matchedRequests.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    const SectionTitle(title: 'Matched Opponents'),
                    const SizedBox(height: 8),
                    ...matchedRequests.map((req) => OpponentCard(request: req)),
                  ],
                  if (pendingRequests.isEmpty && matchedRequests.isEmpty)
                    const Center(child: Text("No opponent requests yet")),
                ],
              ),
            ),
    );
  }
}

// === Models & UI Components ===
enum RequestStatus { pending, matched }

class OpponentRequest {
  final String opponentName;
  final String requestTime;
  final RequestStatus status;

  const OpponentRequest({
    required this.opponentName,
    required this.requestTime,
    required this.status,
  });
}

class SectionTitle extends StatelessWidget {
  final String title;
  const SectionTitle({required this.title, super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
        color: Colors.green,
      ),
    );
  }
}

class OpponentCard extends StatelessWidget {
  final OpponentRequest request;
  const OpponentCard({required this.request, super.key});

  Color getStatusColor() {
    return request.status == RequestStatus.matched ? Colors.green : Colors.orange;
  }

  String getStatusText() {
    return request.status == RequestStatus.matched ? 'Matched' : 'Pending';
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(vertical: 30, horizontal: 26),
        title: Text(request.opponentName,
            style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 18)),
        subtitle: Text('Requested: ${request.requestTime}'),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: getStatusColor().withOpacity(0.2),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            getStatusText(),
            style: TextStyle(
              color: getStatusColor(),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
