// ignore_for_file: avoid_print

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'chat_screen.dart';
//chat system updated
class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  String? playerId;
  final String backendURL = 'http://172.20.10.6:5000';
  bool isLoading = true;
  List<Map<String, dynamic>> conversations = [];

  @override
  void initState() {
    super.initState();
    _loadPlayerData();
  }

  Future<void> _loadPlayerData() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('auth_token');

      final response = await http.get(
        Uri.parse('$backendURL/api/users/me'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final user = json.decode(response.body);
        playerId = user['_id'];
        await _fetchConversations();
      } else {
        print("Failed to get user info: ${response.statusCode}");
      }
    } catch (e) {
      print("Error getting user info: $e");
    }

    setState(() => isLoading = false);
  }

  Future<void> _fetchConversations() async {
    try {
      final res = await http.get(
        Uri.parse('$backendURL/api/chat/conversation?userId=$playerId'),
      );

      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        final fetchedConversations =
            List<Map<String, dynamic>>.from(data['conversations']);

        fetchedConversations.sort((a, b) {
          final aTime = DateTime.tryParse(a['lastMessageTime'] ?? '') ?? DateTime(2000);
          final bTime = DateTime.tryParse(b['lastMessageTime'] ?? '') ?? DateTime(2000);
          return bTime.compareTo(aTime);
        });

        setState(() {
          conversations = fetchedConversations;
        });

        print("Fetched ${conversations.length} conversation(s)");
      } else {
        print("Failed to fetch conversations: ${res.statusCode}");
      }
    } catch (e) {
      print("Error fetching conversations: $e");
    }
  }

  Future<void> _onRefresh() async {
    await _fetchConversations();
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
        title: const Text('Chats'),
        backgroundColor: Colors.green,
        automaticallyImplyLeading: false,
      ),
      body: conversations.isEmpty
          ? const Center(child: Text("No conversations yet"))
          : RefreshIndicator(
              onRefresh: _onRefresh,
              child: ListView.separated(
                itemCount: conversations.length,
                separatorBuilder: (_, __) => const Divider(height: 1, indent: 72),
                itemBuilder: (context, index) {
                  final conv = conversations[index];
                  final lastMsg = conv['lastMessage'] ?? '';
                  final unread = conv['unreadCount'] ?? 0;
                  final isRead = conv['isRead'] ?? false;
                  final lastMessageTime = conv['lastMessageTime'];
                  final formattedTime = lastMessageTime != null
                      ? DateTime.tryParse(lastMessageTime)
                              ?.toLocal()
                              .toString()
                              .substring(11, 16) ??
                          ''
                      : '';

                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.green[300],
                      child: Text(
                        conv['name'].isNotEmpty
                            ? conv['name'][0].toUpperCase()
                            : '?',
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text(
                      conv['name'],
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      lastMsg.isNotEmpty ? lastMsg : conv['role'] ?? '',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: isRead ? Colors.grey : Colors.black87,
                        fontWeight: isRead ? FontWeight.normal : FontWeight.w500,
                      ),
                    ),
                    trailing: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          formattedTime,
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        if (unread > 0)
                          Container(
                            margin: const EdgeInsets.only(top: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.blue,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '$unread',
                              style: const TextStyle(color: Colors.white, fontSize: 12),
                            ),
                          ),
                      ],
                    ),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ChatScreen(
                            playerId: playerId!,
                            receiverId: conv['_id'],
                            receiverName: conv['name'],
                          ),
                        ),
                      );
                    },
                  );
                },
              ),
            ),
    );
  }
}
