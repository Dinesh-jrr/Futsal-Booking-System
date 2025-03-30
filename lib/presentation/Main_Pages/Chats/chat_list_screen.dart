import 'package:flutter/material.dart';
import 'chat_screen.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final String playerId = 'flutter_player_123'; // your user
    final String adminId = 'admin_user_456'; // web admin

    // Dummy conversations — in real app, fetch from backend
    final List<Map<String, dynamic>> conversations = List.generate(10, (index) {
      return {
        'name': 'Futsal Owner ${index + 1}',
        'lastMessage': 'Let me check the schedule...',
        'timestamp': '2:${30 + index} PM',
        'unreadCount': index % 3 == 0 ? 2 : 0,
      };
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text("Chats"),
        backgroundColor: Colors.green,
        centerTitle: true,
        elevation: 0,
      ),
      body: ListView.separated(
        itemCount: conversations.length,
        padding: const EdgeInsets.symmetric(vertical: 12),
        separatorBuilder: (_, __) => const Divider(height: 1, indent: 72),
        itemBuilder: (context, index) {
          final chat = conversations[index];

          return ListTile(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ChatScreen(
                    playerId: playerId,
                    adminId: adminId,
                  ),
                ),
              );
            },
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            leading: CircleAvatar(
              backgroundColor: Colors.green[400],
              radius: 28,
              child: Text(
                chat['name'].split(" ").last[0],
                style: const TextStyle(color: Colors.white, fontSize: 20),
              ),
            ),
            title: Text(
              chat['name'],
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              chat['lastMessage'],
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: Colors.grey),
            ),
            trailing: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  chat['timestamp'],
                  style: const TextStyle(color: Colors.grey, fontSize: 12),
                ),
                if (chat['unreadCount'] > 0)
                  Container(
                    margin: const EdgeInsets.only(top: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${chat['unreadCount']}',
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
