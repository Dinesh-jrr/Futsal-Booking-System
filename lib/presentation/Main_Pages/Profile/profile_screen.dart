// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:player/presentation/Main_Pages/Profile/payment_history.dart';
import 'package:player/presentation/Main_Pages/Profile/booking_history.dart';
import 'package:player/presentation/Main_Pages/Profile/change_password.dart';
import 'package:player/presentation/Main_Pages/Profile/edit_profile_screen.dart';
import 'package:player/presentation/Main_Pages/Profile/opponent_finder.dart';


class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Profile'),
        centerTitle: true,
        backgroundColor: Colors.green,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              // Profile Image Section
              const Center(
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 80,
                      backgroundColor: Colors.green,
                      backgroundImage: AssetImage(
                          'assets/images/futsal_pitch.jpg'), // Replace with user image
                    ),
                    // Positioned(
                    //   bottom: 0,
                    //   right: 0,
                    //   child: CircleAvatar(
                    //     radius: 25,
                    //     backgroundColor: Colors.green,
                    //     // child: IconButton(
                    //     //   icon: const Icon(
                    //     //     Icons.edit,
                    //     //     color: Colors.white,
                    //     //     size: 20,
                    //     //   ),
                    //     //   onPressed: () {
                    //     //     // Handle profile picture update
                    //     //   },
                    //     // ),
                    //   ),
                    // ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // User Info
              const Text(
                'Dinesh Singh',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'jrdinesh1@email.com',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 20),

              // Edit Profile Button
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const EditProfileScreen()),
                  ); // Add your route here
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 60, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: const Text(
                  'Edit Profile',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                
                ),
              ),
              const SizedBox(height: 30),

              // Feature Options
              ListTile(
                leading: const Icon(Icons.lock, color: Colors.green),
                title: const Text(
                  'Change Password',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                trailing:
                    const Icon(Icons.arrow_forward_ios, color: Colors.grey),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const ChangePasswordScreen()),
                  );
                },
              ),
              const Divider(),

              ListTile(
                leading: const Icon(Icons.sports_soccer, color: Colors.green),
                title: const Text(
                  'Opponent Finder',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                trailing:
                    const Icon(Icons.arrow_forward_ios, color: Colors.grey),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const OpponentFinderScreen()),
                  );
                },
              ),
              const Divider(),

              ListTile(
                leading: const Icon(Icons.history, color: Colors.green),
                title: const Text(
                  'Booking History',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                trailing:
                    const Icon(Icons.arrow_forward_ios, color: Colors.grey),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const BookingHistoryScreen()),
                  );
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.payment, color: Colors.green),
                title: const Text(
                  'My Payments',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                trailing:
                    const Icon(Icons.arrow_forward_ios, color: Colors.grey),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const MyPaymentsScreen()),
                  );
                },
              ),
              const Divider(),

              const SizedBox(height: 40),

              // Logout Button
              ElevatedButton(
                onPressed: () async {
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.remove('auth_token');
                  Navigator.pushNamedAndRemoveUntil(
                      context, '/signin', (route) => false);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 60, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                ),
                child: const Text(
                  'Logout',
                  style: TextStyle(fontSize: 18, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
