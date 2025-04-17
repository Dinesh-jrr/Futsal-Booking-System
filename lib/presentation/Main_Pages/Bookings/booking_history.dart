// ignore_for_file: depend_on_referenced_packages, avoid_print

import 'package:flutter/material.dart';
// import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/theme/app_colors.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'booking_details.dart';
import 'package:player/core/config/constants.dart';

class BookingHistory extends StatefulWidget {
  const BookingHistory({super.key});

  @override
  State<BookingHistory> createState() => _BookingHistoryState();
}

class _BookingHistoryState extends State<BookingHistory> {
  String selectedTimeFrame = 'Today';
  String selectedStatus = 'Upcoming';
  List<Map<String, dynamic>> bookings = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchBookings();
  }

  Future<void> fetchBookings() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) throw Exception("Token not found in SharedPreferences");

      final res = await http.get(
        Uri.parse("${AppConfig.baseUrl}/api/users/me"),
        headers: { 'Authorization': 'Bearer $token' },
      );

      if (res.statusCode == 200) {
        final user = jsonDecode(res.body);
        final userId = user['_id'];
        print("Fetched user ID: $userId");

        final bookingsRes = await http.get(
          Uri.parse("${AppConfig.baseUrl}/api/bookings/user/$userId"),
        );

        if (bookingsRes.statusCode == 200) {
          final jsonData = jsonDecode(bookingsRes.body);
          setState(() {
            bookings = List<Map<String, dynamic>>.from(jsonData['bookings']);
            isLoading = false;
          });
        } else {
          throw Exception("Failed to fetch bookings");
        }
      } else {
        throw Exception("Failed to fetch user info");
      }
    } catch (e) {
      print("Error fetching bookings: $e");
      setState(() => isLoading = false);
    }
  }

  DateTime _getStartDate(String timeframe) {
    DateTime now = DateTime.now();
    switch (timeframe) {
      case 'Today':
        return now;
      case '1 Week':
        return now.subtract(const Duration(days: 7));
      case '1 Month':
        return DateTime(now.year, now.month - 1, now.day);
      case '1 Year':
        return DateTime(now.year - 1, now.month, now.day);
      default:
        return now;
    }
  }

  List<Map<String, dynamic>> _filterBookings() {
    DateTime startDate = _getStartDate(selectedTimeFrame);
    return bookings.where((booking) {
      final dateStr = booking['date'];
      final statusStr = booking['status'];

      if (dateStr == null || statusStr == null) return false;

      DateTime bookingDate;
      try {
        bookingDate = DateTime.parse(dateStr);
      } catch (_) {
        return false;
      }

      bool isAfterDate = bookingDate.isAfter(startDate);
      bool matchesStatus = statusStr == selectedStatus;

      return isAfterDate && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final filteredBookings = _filterBookings();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings'),
        centerTitle: true,
        backgroundColor: AppColors.primary,
        automaticallyImplyLeading: false,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: [
                _buildDropdown('Time', selectedTimeFrame, ['Today', '1 Week', '1 Month', '1 Year'], (val) {
                  setState(() => selectedTimeFrame = val!);
                }),
                const SizedBox(width: 12),
                _buildDropdown('Status', selectedStatus, ['Upcoming', 'Completed', 'Cancelled'], (val) {
                  setState(() => selectedStatus = val!);
                }),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: filteredBookings.length,
              itemBuilder: (context, index) {
                final booking = filteredBookings[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => Bookingdetails(booking: booking)),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [
                        BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 3))
                      ],
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.sports_soccer, size: 36, color: Colors.teal),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                booking['futsalName'] ?? 'Futsal Match',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                '${booking['date'] ?? 'Date'} at ${booking['timeSlot'] ?? ''}',
                                style: TextStyle(color: Colors.grey[600]),
                              ),
                            ],
                          ),
                        ),
                        _buildStatusChip(booking['status'] ?? 'Unknown'),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      backgroundColor: const Color(0xFFF4F4F4),
    );
  }

  Widget _buildDropdown(String label, String value, List<String> items, ValueChanged<String?> onChanged) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border.all(color: AppColors.primary, width: 1.2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: DropdownButton<String>(
          value: value,
          isExpanded: true,
          underline: const SizedBox.shrink(),
          onChanged: onChanged,
          items: items.map((item) => DropdownMenuItem(value: item, child: Text(item))).toList(),
        ),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color color;
    IconData icon;

    switch (status) {
      case 'Upcoming':
        color = Colors.blue;
        icon = Icons.schedule;
        break;
      case 'Completed':
        color = Colors.green;
        icon = Icons.check_circle_outline;
        break;
      case 'Cancelled':
        color = Colors.red;
        icon = Icons.cancel_outlined;
        break;
      default:
        color = Colors.grey;
        icon = Icons.help_outline;
    }

    return Chip(
      avatar: Icon(icon, size: 16, color: Colors.white),
      label: Text(status, style: const TextStyle(color: Colors.white)),
      backgroundColor: color,
    );
  }
}
