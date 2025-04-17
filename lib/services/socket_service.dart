// ignore_for_file: avoid_print, library_prefixes

import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'package:player/core/config/constants.dart';

class SocketService {
  late IO.Socket socket;
  final String userId;

  SocketService(this.userId);

  void initSocket() {
    // ignore: unnecessary_string_interpolations
    socket = IO.io('${AppConfig.baseUrl}', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.onConnect((_) {
      print('Connected: ${socket.id}');
      socket.emit('client_ready', 'Hello from Flutter');
      socket.emit('join', userId);
    });

    socket.onDisconnect((_) => print('Disconnected'));
    socket.onConnectError((err) => print('Connection Error: $err'));
    socket.onError((err) => print('Error: $err'));
  }

  void sendMessage(String receiverId, String message) {
    socket.emit('sendMessage', {
      'senderId': userId,
      'receiverId': receiverId,
      'message': message,
    });
  }

  void onMessage(void Function(Map<String, dynamic>) callback) {
    socket.on('newMessage', (data) {
      callback(Map<String, dynamic>.from(data));
    });
  }

  void dispose() {
    socket.dispose();
  }
}
