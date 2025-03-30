// chat_list_screen.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'chat_screen.dart';

class ChatListScreen extends StatefulWidget {
  const ChatListScreen({super.key});

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  String? playerId;
  final String backendURL = 'http://192.168.1.4:5000';
  bool isLoading = true;
  List<Map<String, dynamic>> conversations = [];

  @override
  void initState() {
    super.initState();
    _loadPlayerData();
  }

  Future<void> _loadPlayerData() async {
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
    }

    setState(() => isLoading = false);
  }

  Future<void> _fetchConversations() async {
    final res = await http.get(Uri.parse('$backendURL/api/chat/conversation?userId=$playerId'));

    if (res.statusCode == 200) {
      final data = json.decode(res.body);
      conversations = List<Map<String, dynamic>>.from(data['tutors']);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Chats'), backgroundColor: Colors.green),
      body: conversations.isEmpty
          ? const Center(child: Text("No conversations yet"))
          : ListView.builder(
              itemCount: conversations.length,
              itemBuilder: (context, index) {
                final conv = conversations[index];
                return ListTile(
                  leading: CircleAvatar(child: Text(conv['name'][0].toUpperCase())),
                  title: Text(conv['name']),
                  subtitle: Text(conv['role'] ?? 'User'),
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
    );
  }
}
