// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:player/presentation/Main_Pages/Chats/chat_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

class BookingDetails extends StatelessWidget {
  final Map<String, dynamic> booking;

  const BookingDetails({super.key, required this.booking});

  @override
  Widget build(BuildContext context) {
    final status = booking['status'] ?? 'Unknown';
    final statusColor = _getStatusColor(status);
    final statusIcon = _getStatusIcon(status);
    final statusLower = status.toLowerCase();
    final isApproved = statusLower == 'confirmed';
    final showCancel = statusLower == 'confirmed' || statusLower == 'pending';
    final String formattedDate = DateTime.parse(booking['selectedDay'])
        .toLocal()
        .toString()
        .split(' ')[0];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Booking Details'),
        backgroundColor: Colors.teal,
        centerTitle: true,
      ),
      backgroundColor: const Color(0xFFF4F4F4),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Booking Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(
                    blurRadius: 10,
                    color: Colors.black12,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.sports_soccer,
                          size: 32, color: Colors.teal),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          booking['futsalId']?['futsalName'] ?? 'Futsal Match',
                          style: const TextStyle(
                              fontSize: 22, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    children: [
                      const Icon(Icons.calendar_today,
                          size: 20, color: Colors.grey),
                      const SizedBox(width: 8),
                      Text(formattedDate, style: const TextStyle(fontSize: 16)),
                      const SizedBox(width: 20),
                      const Icon(Icons.access_time,
                          size: 20, color: Colors.grey),
                      const SizedBox(width: 8),
                      Text(booking['selectedTimeSlot'] ?? 'N/A',
                          style: const TextStyle(fontSize: 16)),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Chip(
                        avatar: Icon(statusIcon, color: Colors.white, size: 18),
                        label: Text(status,
                            style: const TextStyle(color: Colors.white)),
                        backgroundColor: statusColor,
                      ),
                      if (showCancel)
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 10),
                          ),
                          icon: const Icon(Icons.cancel, size: 18),
                          label: const Text('Cancel',
                              style: TextStyle(fontSize: 14)),
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (context) => AlertDialog(
                                title: const Text('Cancel Booking?'),
                                content: const Text(
                                    'Are you sure you want to cancel this booking?'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('No'),
                                  ),
                                  TextButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                      // TODO: Trigger cancel logic
                                      ScaffoldMessenger.of(context)
                                          .showSnackBar(
                                        const SnackBar(
                                            content: Text(
                                                'Booking cancelled successfully')),
                                      );
                                    },
                                    child: const Text('Yes, Cancel'),
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Match Info
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.teal[50],
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Match Details',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'This is a friendly futsal match. Be on time and bring your futsal shoes. The venue will provide bibs and water. Make sure to warm up before the game!',
                    style: TextStyle(
                        fontSize: 15, color: Colors.black87, height: 1.4),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Actions if Approved
            if (isApproved) ...[
              const Text(
                'Actions',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Message Button
                  ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Theme.of(context).primaryColor,
                        side: BorderSide(color: Theme.of(context).primaryColor),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 12),
                      ),
                      icon: const Icon(Icons.message),
                      label: const Text(
                        'Send Message',
                        style: TextStyle(fontSize: 15),
                      ),
                      onPressed: () async {
                        final futsal = booking['futsalId'];
                        final owner = futsal != null ? futsal['ownerId'] : null;

                        if (owner == null || owner['_id'] == null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Owner not found')),
                          );
                          return;
                        }

                        final prefs = await SharedPreferences.getInstance();
                        final currentUserId = prefs.getString('user_id');

                        if (currentUserId == null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('User ID not found')),
                          );
                          return;
                        }

                        final ownerId = owner['_id'];
                        final ownerName = owner['name'] ?? 'Owner';

                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ChatScreen(
                              playerId: currentUserId,
                              receiverId: ownerId,
                              receiverName: ownerName,
                            ),
                          ),
                        );
                      }),

                  // Location Button
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: Theme.of(context).primaryColor,
                      side: BorderSide(color: Theme.of(context).primaryColor),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 12),
                    ),
                    icon: const Icon(Icons.location_on),
                    label: const Text(
                      'View Location',
                      style: TextStyle(fontSize: 15),
                    ),
                    onPressed: () async {
                      final lat = booking['coordinates']?['lat'];
                      final lng = booking['coordinates']?['lng'];
                      final googleMapsUrl = (lat != null && lng != null)
                          ? 'https://www.google.com/maps/search/?api=1&query=$lat,$lng'
                          : null;

                      if (googleMapsUrl != null &&
                          await canLaunchUrl(Uri.parse(googleMapsUrl))) {
                        await launchUrl(Uri.parse(googleMapsUrl));
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text('Location not available')),
                        );
                      }
                    },
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return Icons.check_circle_outline;
      case 'pending':
        return Icons.hourglass_bottom;
      case 'cancelled':
        return Icons.cancel_outlined;
      default:
        return Icons.help_outline;
    }
  }
}
