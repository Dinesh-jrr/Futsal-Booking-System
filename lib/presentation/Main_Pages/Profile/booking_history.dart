import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/config/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class BookingHistoryScreen extends StatefulWidget {
  const BookingHistoryScreen({super.key});

  @override
  State<BookingHistoryScreen> createState() => _BookingHistoryScreenState();
}

class _BookingHistoryScreenState extends State<BookingHistoryScreen> {
  List<Booking> bookings = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchBookingHistory();
  }

  Future<void> fetchBookingHistory() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) throw Exception("Token not found");

      final userRes = await http.get(
        Uri.parse("${AppConfig.baseUrl}/api/users/me"),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (userRes.statusCode != 200) throw Exception("Failed to fetch user");
      final user = jsonDecode(userRes.body);
      final userId = user['_id'];

      final bookingRes = await http.get(
        Uri.parse("${AppConfig.baseUrl}/api/bookings/user/$userId"),
      );

      if (bookingRes.statusCode == 200) {
        final jsonData = jsonDecode(bookingRes.body);
        final List<dynamic> bookingList = jsonData['bookings'];

        setState(() {
          bookings = bookingList.map((b) {
            return Booking(
              futsalName: b['futsalName'] ?? 'Unknown',
              date: b['selectedDay']?.toString().split('T')[0] ?? '',
              time: b['selectedTimeSlot'] ?? '',
              price: double.tryParse(b['totalCost'].toString()) ?? 0,
              status: _mapStatus(b['status']),
            );
          }).toList();
          isLoading = false;
        });
      } else {
        throw Exception("Failed to fetch bookings");
      }
    } catch (e) {
      print("Error: $e");
      setState(() => isLoading = false);
    }
  }

  BookingStatus _mapStatus(String? status) {
    switch (status?.toLowerCase()) {    
      case 'confirmed':
        return BookingStatus.confirmed;
      case 'cancelled':
        return BookingStatus.cancelled;
      case 'pending':
      default:
        return BookingStatus.pending;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Booking History'),
        backgroundColor: Colors.green,
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : bookings.isEmpty
              ? const Center(child: Text('No bookings found', style: TextStyle(fontSize: 18, color: Colors.grey)))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: bookings.length,
                  itemBuilder: (context, index) {
                    final booking = bookings[index];
                    return BookingCard(booking: booking);
                  },
                ),
    );
  }
}

// Model
class Booking {
  final String futsalName;
  final String date;
  final String time;
  final BookingStatus status;
  final double price;

  const Booking({
    required this.futsalName,
    required this.date,
    required this.time,
    required this.status,
    required this.price,
  });
}

enum BookingStatus { pending, confirmed, cancelled,}

class BookingCard extends StatelessWidget {
  final Booking booking;
  const BookingCard({required this.booking, super.key});

  Color getStatusColor() {
    switch (booking.status) {
      case BookingStatus.confirmed:
        return Colors.green;
      case BookingStatus.pending:
        return Colors.orange;
      case BookingStatus.cancelled:
        return Colors.red;
    }
  }

  IconData getStatusIcon() {
    switch (booking.status) {
      case BookingStatus.confirmed:
        return Icons.check_circle;
      case BookingStatus.pending:
        return Icons.hourglass_top;
      case BookingStatus.cancelled:
        return Icons.cancel;
    }
  }

  String getStatusText() {
    switch (booking.status) {
      case BookingStatus.confirmed:
        return 'Completed';
      case BookingStatus.pending:
        return 'Pending';
      case BookingStatus.cancelled:
        return 'Cancelled';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              booking.futsalName,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 6),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                const SizedBox(width: 6),
                Text(booking.date, style: const TextStyle(color: Colors.grey, fontSize: 14)),
                const SizedBox(width: 16),
                const Icon(Icons.access_time, size: 16, color: Colors.grey),
                const SizedBox(width: 6),
                Text(booking.time, style: const TextStyle(color: Colors.grey, fontSize: 14)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Chip(
                  backgroundColor: getStatusColor().withOpacity(0.15),
                  label: Row(
                    children: [
                      Icon(getStatusIcon(), color: getStatusColor(), size: 18),
                      const SizedBox(width: 6),
                      Text(
                        getStatusText(),
                        style: TextStyle(color: getStatusColor(), fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
                Text(
                  'Rs ${booking.price.toStringAsFixed(0)}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Colors.green),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
