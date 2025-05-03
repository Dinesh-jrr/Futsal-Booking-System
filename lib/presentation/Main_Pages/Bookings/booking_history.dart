// ignore_for_file: depend_on_referenced_packages, avoid_print

import 'package:flutter/material.dart';
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
  List<Map<String, dynamic>> todayBookings = [];
  List<Map<String, dynamic>> otherBookings = [];
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
      if (token == null)
        throw Exception("Token not found in SharedPreferences");

      final res = await http.get(
        Uri.parse("${AppConfig.baseUrl}/api/users/me"),
        headers: {'Authorization': 'Bearer $token'},
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
            List<Map<String, dynamic>> allBookings =
                List<Map<String, dynamic>>.from(jsonData['bookings']);

            // Separate today's bookings and other bookings
            DateTime now = DateTime.now();
            todayBookings = allBookings.where((booking) {
              DateTime bookingDate = DateTime.parse(booking['createdAt']);
              return isSameDay(now, bookingDate);
            }).toList();

            otherBookings = allBookings.where((booking) {
              DateTime bookingDate = DateTime.parse(booking['createdAt']);
              return !isSameDay(now, bookingDate);
            }).toList();

            todayBookings.sort((a, b) => DateTime.parse(b['createdAt'])
                .compareTo(DateTime.parse(a['createdAt'])));
            otherBookings.sort((a, b) => DateTime.parse(b['createdAt'])
                .compareTo(DateTime.parse(a['createdAt'])));
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

  // Helper function to check if two dates are the same day
  bool isSameDay(DateTime date1, DateTime date2) {
    return date1.year == date2.year &&
        date1.month == date2.month &&
        date1.day == date2.day;
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings'),
        centerTitle: true,
        backgroundColor: AppColors.primary,
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        children: [
          if (todayBookings.isNotEmpty) ...[
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              child: Text('Today',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            ),
            ...todayBookings.map((booking) => _buildBookingCard(booking)),
          ],
          if (otherBookings.isNotEmpty) ...[
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
              child: Text('Upcoming / Past',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            ),
            ...otherBookings.map((booking) => _buildBookingCard(booking)),
          ],
        ],
      ),
      backgroundColor: const Color(0xFFF4F4F4),
    );
  }

  Widget _buildBookingCard(Map<String, dynamic> booking) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => BookingDetails(booking: booking)),
        );
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: const [
            BoxShadow(
                color: Colors.black12, blurRadius: 8, offset: Offset(0, 3))
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
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    booking['selectedDay'] != null
                        ? DateTime.parse(booking['selectedDay']).toLocal().toString().split(' ')[0]
                        : 'Selected day',
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
  }

  Widget _buildStatusChip(String status) {
  Color color;
  IconData icon;

  switch (status.toLowerCase()) {
    case 'upcoming':
      color = Colors.blue;
      icon = Icons.schedule;
      break;
    case 'completed':
      color = Colors.green;
      icon = Icons.check_circle_outline;
      break;
    case 'cancelled':
      color = Colors.red;
      icon = Icons.cancel_outlined;
      break;
    case 'confirmed':
      color = AppColors.primary;
      icon = Icons.verified;
      break;
    case 'pending':
      color = Colors.orange;
      icon = Icons.hourglass_empty;
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
