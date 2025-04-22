import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:player/core/theme/app_theme.dart';
import 'package:player/presentation/splash/pages/splash.dart';
import 'package:player/presentation/Main_Pages/navbar_roots.dart';
import 'package:player/presentation/auth/pages/signin.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

Future<void> _initializeNotifications() async {
  const AndroidInitializationSettings androidInitSettings =
      AndroidInitializationSettings('ic_stat_icon'); // Ensure this icon exists in res/drawable

  const InitializationSettings initSettings =
      InitializationSettings(android: androidInitSettings);

  await flutterLocalNotificationsPlugin.initialize(initSettings);
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await _initializeNotifications();

  // ✅ Listen to foreground FCM and show local notification
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    RemoteNotification? notification = message.notification;
    AndroidNotification? android = message.notification?.android;

    if (notification != null && android != null) {
      flutterLocalNotificationsPlugin.show(
        notification.hashCode,
        notification.title,
        notification.body,
        const NotificationDetails(
          android: AndroidNotificationDetails(
            'futsal_channel', // channel id
            'Futsal Notifications', // channel name
            channelDescription:
                'Notifications for futsal bookings and payments',
            importance: Importance.max,
            priority: Priority.high,
            icon: 'ic_stat_icon', // Make sure this matches your res/drawable
          ),
        ),
      );
    }
  });

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SplashPage(),
      routes: {
        '/home': (context) => const Navbar(),
        '/signin': (context) => const SignIn(),
      },
    );
  }
}
