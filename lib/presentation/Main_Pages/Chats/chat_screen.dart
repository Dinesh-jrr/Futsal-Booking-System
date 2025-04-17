// ignore_for_file: library_private_types_in_public_api, avoid_print, deprecated_member_use

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../services/socket_service.dart';
import 'package:player/core/config/constants.dart';

class ChatScreen extends StatefulWidget {
  final String playerId;
  final String receiverId;
  final String receiverName;

  const ChatScreen({
    super.key,
    required this.playerId,
    required this.receiverId,
    required this.receiverName,
  });

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  late SocketService socketService;

  // ignore: unnecessary_string_interpolations
  final String backendURL = '${AppConfig.baseUrl}';
  List<Map<String, String>> messages = [];

  @override
  void initState() {
    super.initState();
    socketService = SocketService(widget.playerId);
    socketService.initSocket();

    _loadChatHistory();
    _markMessagesAsRead();

    socketService.onMessage((data) {
      setState(() {
        messages.add({
          'sender': widget.receiverId,
          'text': data['content'] ?? '',
          'timestamp': _formattedTime(),
        });
      });
    });
  }

  Future<void> _loadChatHistory() async {
    try {
      final res = await http.get(Uri.parse(
        '$backendURL/api/chat/chat-history?userId1=${widget.playerId}&userId2=${widget.receiverId}',
      ));

      if (res.statusCode == 200) {
        final List history = json.decode(res.body)['data'];
        setState(() {
          messages = history.map<Map<String, String>>((msg) {
            return {
              'sender': msg['sender']['_id'],
              'text': msg['message'],
              'timestamp': msg['createdAt'],
            };
          }).toList();
        });
      } else {
        print("Failed to load chat history: ${res.statusCode}");
      }
    } catch (e) {
      print("Error loading chat history: $e");
    }
  }

  Future<void> _markMessagesAsRead() async {
    try {
      await http.post(
        Uri.parse('$backendURL/api/chat/mark-read'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'senderId': widget.receiverId,
          'receiverId': widget.playerId,
        }),
      );
    } catch (e) {
      print("Error marking messages as read: $e");
    }
  }

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      messages.add({
        'sender': widget.playerId,
        'text': text,
        'timestamp': _formattedTime(),
      });
    });

    socketService.sendMessage(widget.receiverId, text);
    _controller.clear();

    // Save to DB
    http.post(
      Uri.parse('$backendURL/api/chat/send'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'senderId': widget.playerId,
        'receiverId': widget.receiverId,
        'message': text,
      }),
    );
  }

  String _formattedTime() {
    final now = DateTime.now();
    return "${now.hour}:${now.minute.toString().padLeft(2, '0')}";
  }

  @override
  void dispose() {
    socketService.dispose();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        title: Row(
          children: [
            const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.person, color: Colors.green),
            ),
            const SizedBox(width: 10),
            Text(widget.receiverName),
          ],
        ),
        backgroundColor: Colors.green,
        elevation: 1,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              padding: const EdgeInsets.all(12),
              itemCount: messages.length,
              itemBuilder: (context, index) {
                var message = messages[messages.length - 1 - index];
                bool isMe = message['sender'] == widget.playerId;

                return Align(
                  alignment:
                      isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                        maxWidth: MediaQuery.of(context).size.width * 0.75),
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 6),
                      padding:
                          const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
                      decoration: BoxDecoration(
                        color: isMe ? Colors.green[400] : Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: const Radius.circular(16),
                          topRight: const Radius.circular(16),
                          bottomLeft: Radius.circular(isMe ? 16 : 0),
                          bottomRight: Radius.circular(isMe ? 0 : 16),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            offset: const Offset(0, 1),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            message['text'] ?? '',
                            style: TextStyle(
                              color: isMe ? Colors.white : Colors.black87,
                              fontSize: 15,
                              height: 1.4,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Align(
                            alignment: Alignment.bottomRight,
                            child: Text(
                              message['timestamp'] != null
                                  ? DateTime.tryParse(message['timestamp']!)
                                          ?.toLocal()
                                          .toString()
                                          .substring(11, 16) ??
                                      ''
                                  : '',
                              style: TextStyle(
                                color: isMe ? Colors.white70 : Colors.grey,
                                fontSize: 11,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const Divider(height: 1),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: TextField(
                      controller: _controller,
                      minLines: 1,
                      maxLines: 5,
                      decoration: const InputDecoration(
                        hintText: "Type a message...",
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                CircleAvatar(
                  backgroundColor: Colors.green,
                  radius: 24,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: _sendMessage,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
