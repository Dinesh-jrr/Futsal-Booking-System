import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/config/constants.dart';
import '../HomePage/futsal_detail_screen.dart';

class NearbyFutsalPage extends StatefulWidget {
  const NearbyFutsalPage({super.key});

  @override
  State<NearbyFutsalPage> createState() => _NearbyFutsalPageState();
}

class _NearbyFutsalPageState extends State<NearbyFutsalPage> {
  List<Map<String, dynamic>> futsals = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchFutsals();
  }

  Future<void> fetchFutsals() async {
    try {
      final response = await http.get(Uri.parse('${AppConfig.baseUrl}/api/getfutsals'));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        final List<dynamic> data = decoded['futsals'];
        final List<Map<String, dynamic>> fetched = data.cast<Map<String, dynamic>>();

        setState(() {
          futsals = fetched;
          isLoading = false;
        });
      } else {
        throw Exception('Failed to load futsals');
      }
    } catch (e) {
      print('Error fetching futsals: $e');
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Nearby Futsal",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.green,
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(10),
              itemCount: futsals.length,
              itemBuilder: (context, index) {
                final futsal = futsals[index];
                return FutsalCard(
                  name: futsal['futsalName'],
                  location: futsal['location'],
                  price: futsal['pricePerHour'],
                  availability: "Yes", // You can update if backend sends availability too
                  imageUrl: (futsal['images'] != null && futsal['images'].isNotEmpty)
                      ? futsal['images'][0]
                      : 'assets/images/futsal_pitch.jpg', // fallback if no image
                  onTap: () => _navigateToDetail(context, futsal['_id']),
                );
              },
            ),
    );
  }

  void _navigateToDetail(BuildContext context, String futsalId) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FutsalDetailScreen(futsalId: futsalId),
      ),
    );
  }
}

class FutsalCard extends StatelessWidget {
  final String name;
  final String location;
  final int price;
  final String availability;
  final String imageUrl;
  final VoidCallback onTap;

  const FutsalCard({
    super.key,
    required this.name,
    required this.location,
    required this.price,
    required this.availability,
    required this.imageUrl,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: BorderSide(color: Colors.green.shade300, width: 1),
        ),
        margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 5),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      location,
                      style: TextStyle(color: Colors.grey[700], fontSize: 14),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Text(
                          "Availability: ",
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          availability,
                          style: TextStyle(
                            fontSize: 14,
                            color: availability == "Yes" ? Colors.green : Colors.red,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "Price: NPR $price",
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  imageUrl,
                  width: 80,
                  height: 60,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Icon(Icons.broken_image),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
