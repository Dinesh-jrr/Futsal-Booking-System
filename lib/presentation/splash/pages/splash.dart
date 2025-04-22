// ignore_for_file: use_build_context_synchronously, avoid_print, depend_on_referenced_packages

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:player/core/config/constants.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:player/presentation/Main_Pages/navbar_roots.dart';
import 'package:player/presentation/intro/pages/get_started_screen.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  @override
  void initState() {
    super.initState();
    _initializeFCM();
    redirect();
  }

  Future<void> _initializeFCM() async {
    // Ask for permission (Android 13+)
    await FirebaseMessaging.instance.requestPermission();

    const AndroidInitializationSettings androidInit =
        AndroidInitializationSettings('./assets/images/logo.png');

    const InitializationSettings initSettings = InitializationSettings(
      android: androidInit,
    );

    await flutterLocalNotificationsPlugin.initialize(initSettings);

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
              'futsal_channel', // same ID in AndroidManifest if needed
              'Futsal Notifications',
              importance: Importance.max,
              priority: Priority.high,
              playSound: true,
              enableVibration: true,
            ),
          ),
        );
      }
    });
  }

  Future<void> redirect() async {
    await Future.delayed(const Duration(seconds: 5));

    final fcmToken = await FirebaseMessaging.instance.getToken();
    print("📦 FCM Token: $fcmToken");

    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
    final userId = prefs.getString('user_id') ?? 'unknown_user';

    print("📛 userId from SharedPreferences: $userId");
    print("saving token to database...");

    if (fcmToken != null && userId != 'unknown_user') {
      try {
        final response = await http.post(
          Uri.parse('${AppConfig.baseUrl}/api/token/save'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'userId': userId, 'fcmToken': fcmToken}),
        );

        print('📤 Status Code: ${response.statusCode}');
        print('📤 Response Body: ${response.body}');

        if (response.statusCode == 200) {
          print('✅ Token saved successfully to backend');
        } else {
          print('⚠️ Failed to save token. Status: ${response.statusCode}');
        }
      } catch (e) {
        print('❌ Error sending token: $e');
      }
    } else {
      print('❌ Token or userId is invalid. Skipping upload.');
    }

    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (BuildContext context) =>
            isLoggedIn ? const Navbar() : const GetStartedScreen(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Image.asset(
            './assets/images/logo.png',
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }
}
