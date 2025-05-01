import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
// ignore: depend_on_referenced_packages
import 'package:intl/intl.dart';
import 'package:player/core/config/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({Key? key}) : super(key: key);

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  List<dynamic> notifications = [];
  String? userId;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    loadUserIdAndFetch();
  }

  Future<void> loadUserIdAndFetch() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    userId = prefs.getString('user_id');
    if (userId != null) {
      await fetchNotifications();
    }
  }

  Future<void> fetchNotifications() async {
    setState(() => isLoading = true);
    final response = await http.get(Uri.parse('${AppConfig.baseUrl}/api/notification/notifications/$userId'));
    if (response.statusCode == 200) {
      setState(() {
        notifications = json.decode(response.body);
        isLoading = false;
      });
    } else {
      setState(() => isLoading = false);
    }
  }

  Future<void> markAsRead(String notificationId) async {
    await http.put(Uri.parse('${AppConfig.baseUrl}/api/notifications/$notificationId/read'));
    await fetchNotifications();
  }

  Future<void> deleteNotification(String notificationId) async {
    await http.delete(Uri.parse('${AppConfig.baseUrl}/api/notifications/$notificationId'));
    await fetchNotifications();
  }

  String formatDate(String date) {
    final dt = DateTime.parse(date);
    return DateFormat('MMM d, yyyy h:mm a').format(dt);
  }

  @override
  Widget build(BuildContext context) {
    int unreadCount = notifications.where((n) => !n['isRead']).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Notifications"),
        actions: [
          if (unreadCount > 0)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text("$unreadCount unread", style: const TextStyle(color: Colors.white)),
                ),
              ),
            )
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notifications.isEmpty
              ? const Center(child: Text("No notifications yet"))
              : SingleChildScrollView( // Make the content scrollable
                  child: Padding(
                    padding: const EdgeInsets.all(8.0), // Add padding to avoid content touching screen edges
                    child: Column(
                      children: List.generate(notifications.length, (index) {
                        final notif = notifications[index];
                        return Card(
                          color: notif['isRead'] ? Colors.white : Colors.green.shade50,
                          margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                          child: ListTile(
                            title: Text(notif['title'], style: const TextStyle(fontWeight: FontWeight.bold)),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(notif['message']),
                                const SizedBox(height: 4),
                                Text(formatDate(notif['createdAt']), style: const TextStyle(fontSize: 12, color: Colors.grey)),
                              ],
                            ),
                            trailing: Column(
                              children: [
                                if (!notif['isRead'])
                                  IconButton(
                                    icon: const Icon(Icons.mark_email_read, color: Colors.blue),
                                    tooltip: 'Mark as Read',
                                    onPressed: () => markAsRead(notif['_id']),
                                  ),
                                IconButton(
                                  icon: const Icon(Icons.delete, color: Colors.red),
                                  tooltip: 'Delete',
                                  onPressed: () => deleteNotification(notif['_id']),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ),
                  ),
                ),
    );
  }
}
