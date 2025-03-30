import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;
  final String userId;

  SocketService(this.userId);

  void initSocket() {
    socket = IO.io('http://localhost:5000', <String, dynamic>{
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
