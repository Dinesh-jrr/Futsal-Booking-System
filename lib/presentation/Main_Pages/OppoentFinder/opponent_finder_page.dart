// ignore_for_file: use_build_context_synchronously, deprecated_member_use

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:player/core/config/constants.dart';
import 'package:player/core/theme/app_colors.dart';
import 'package:player/utils/toast_helper.dart';
import 'package:shimmer/shimmer.dart';
import 'dart:async';

class OpponentFinderPage extends StatefulWidget {
  const OpponentFinderPage({super.key});

  @override
  State<OpponentFinderPage> createState() => _OpponentFinderPageState();
}

class _OpponentFinderPageState extends State<OpponentFinderPage> {
  final TextEditingController _locationController = TextEditingController();
  DateTime? selectedDate;
  List<String> selectedTimes = [];
  bool isSubmitting = false;
  bool waitingForOpponent = false;
  Timer? pollingTimer;
  int pollingCount = 0;
  int requestsToday = 0;

  final List<String> availableTimes = [
    '6-7 AM','7-8 AM','8-9 AM','9-10 AM','10-11 AM','11-12 AM',
    '12-1 PM','1-2 PM','2-3 PM','3-4 PM','4-5 PM','5-6 PM','6-7 PM','7-8 PM','8-9 PM'
  ];

  @override
  void initState() {
    super.initState();
    _fetchRequestCountFromBackend();
  }

  Future<void> _fetchRequestCountFromBackend() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString('user_id');
    if (userId == null) return;

    final response = await http.get(
      Uri.parse('${AppConfig.baseUrl}/api/opponent/requestCount/$userId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        requestsToday = data['requestCount'];
      });
    } else {
      setState(() {
        requestsToday = 0;
      });
    }
  }

  void _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null && picked != selectedDate) {
      setState(() => selectedDate = picked);
    }
  }

  Future<void> _submitRequest() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? userId = prefs.getString('user_id');
    if (userId == null) {
      showToast(
        context: context,
        message: "User not logged in.",
        backgroundColor: Colors.red,
        icon: Icons.error,
      );
      return;
    }

    final response = await http.get(
      Uri.parse('${AppConfig.baseUrl}/api/opponent/requestCount/$userId'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        requestsToday = data['requestCount'];
      });

      if (requestsToday >= 3) {
        showToast(
          context: context,
          message: "You've reached the daily limit of 3 opponent requests.",
          backgroundColor: Colors.orange,
          icon: Icons.lock_clock,
        );
        return;
      } else if (requestsToday == 2) {
        showToast(
          context: context,
          message: "⚠️ Warning: Only 1 request left for today!",
          backgroundColor: Colors.orange,
          icon: Icons.warning,
        );
      }
    }

    if (_locationController.text.isEmpty || selectedDate == null || selectedTimes.isEmpty) {
      showToast(
        context: context,
        message: "Please complete all fields.",
        backgroundColor: Colors.red,
        icon: Icons.warning,
      );
      return;
    }

    setState(() {
      isSubmitting = true;
      waitingForOpponent = false;
      pollingCount = 0;
    });

    final requestData = {
      'userId': userId,
      'preferredLocation': _locationController.text,
      'preferredDate': selectedDate!.toIso8601String(),
      'preferredTimeSlots': selectedTimes,
    };

    try {
      final response = await http.post(
        Uri.parse('${AppConfig.baseUrl}/api/opponent/matchOpponent'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestData),
      );

      final resBody = jsonDecode(response.body);
      setState(() {
        isSubmitting = false;
        waitingForOpponent = true;
      });

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (resBody['message'] == 'Match found and confirmed!') {
          showToast(
            context: context,
            message: "🎉 Opponent matched!",
            backgroundColor: Colors.green,
            icon: Icons.sports_soccer,
          );
          setState(() => waitingForOpponent = false);
        } else {
          pollingTimer = Timer.periodic(const Duration(seconds: 3), (timer) async {
            pollingCount++;

            final checkResponse = await http.post(
              Uri.parse('${AppConfig.baseUrl}/api/opponent/matchOpponent'),
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode(requestData),
            );

            final checkBody = jsonDecode(checkResponse.body);
            if (checkBody['message'] == 'Match found and confirmed!') {
              timer.cancel();
              showToast(
                context: context,
                message: "🎉 Opponent matched!",
                backgroundColor: Colors.green,
                icon: Icons.sports_soccer,
              );
              setState(() => waitingForOpponent = false);
              return;
            }

            if (pollingCount >= 2) {
              timer.cancel();
              showToast(
                context: context,
                message: "No opponent found at this time.",
                backgroundColor: Colors.red,
                icon: Icons.close,
              );
              setState(() => waitingForOpponent = false);
            }
          });
        }
      } else {
        showToast(
          context: context,
          message: "Failed to send request (${response.statusCode})",
          backgroundColor: Colors.red,
          icon: Icons.error_outline,
        );
      }
    } catch (e) {
      setState(() => isSubmitting = false);
      showToast(
        context: context,
        message: "Something went wrong.",
        backgroundColor: Colors.red,
        icon: Icons.warning,
      );
    }
  }

  @override
  void dispose() {
    pollingTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: const Text("Find Opponent"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text("Requests Today", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              LinearProgressIndicator(
                value: requestsToday / 3,
                backgroundColor: Colors.grey.shade300,
                color: requestsToday >= 3 ? Colors.red : AppColors.primary,
                minHeight: 10,
                borderRadius: BorderRadius.circular(6),
              ),
              const SizedBox(height: 8),
              Text("$requestsToday / 3", style: TextStyle(color: requestsToday >= 3 ? Colors.red : Colors.black)),
              const SizedBox(height: 20),
              const Text("Preferred Location", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: _locationController,
                decoration: InputDecoration(
                  hintText: "e.g. Koteshwor, Kathmandu",
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text("Preferred Date", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              InkWell(
                onTap: () => _selectDate(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 20, color: Colors.grey),
                      const SizedBox(width: 10),
                      Text(
                        selectedDate != null ? DateFormat.yMMMMd().format(selectedDate!) : "Select a date",
                        style: const TextStyle(fontSize: 16),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text("Preferred Time Slots (Max 3)", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: availableTimes.map((time) {
                  final isSelected = selectedTimes.contains(time);
                  return ChoiceChip(
                    label: Text(time),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        if (selected && selectedTimes.length < 3) {
                          selectedTimes.add(time);
                        } else if (!selected) {
                          selectedTimes.remove(time);
                        }
                      });
                    },
                    selectedColor: Colors.green[100],
                    backgroundColor: Colors.grey[200],
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.green[800] : Colors.black,
                      fontWeight: FontWeight.w500,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 30),
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: waitingForOpponent
                    ? Shimmer.fromColors(
                        baseColor: AppColors.primary.withOpacity(0.4),
                        highlightColor: AppColors.primary.withOpacity(0.8),
                        child: Container(
                          key: const ValueKey("loading"),
                          height: 50,
                          width: double.infinity,
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              SizedBox(
                                width: 18,
                                height: 18,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  color: Colors.white,
                                ),
                              ),
                              SizedBox(width: 10),
                              Text(
                                "Looking for an opponent...",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    : ElevatedButton(
                        key: const ValueKey("button"),
                        onPressed: _submitRequest,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          "Search Opponent",
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
