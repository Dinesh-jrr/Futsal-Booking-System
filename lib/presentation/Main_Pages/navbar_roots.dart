import 'package:flutter/material.dart';
import 'package:player/core/theme/app_colors.dart';
import 'package:player/presentation/Main_Pages/HomePage/home_page.dart';
import 'package:player/presentation/Main_Pages/Bookings/booking_history.dart';
import 'package:player/presentation/Main_Pages/Chats/chat_list_screen.dart';
import 'package:player/presentation/Main_Pages/Profile/profile_screen.dart';
import 'package:player/presentation/Main_Pages/QR_Payments/cash_payment.dart';
import 'package:player/presentation/Main_Pages/QR_Payments/esewa_qr_code.dart';
import 'package:player/presentation/Main_Pages/QR_Payments/esewa_utils.dart';


class Navbar extends StatefulWidget {
  // final String userId;
  const Navbar({super.key});
  

  @override
  State<Navbar> createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  int _selectedIndex = 0;
  late final List<Widget> _screens;
  double remainingAmount = 500.0;

  @override
  void initState() {
    super.initState();
    _screens = [
      // HomePage(userId: widget.userId),
       const HomePage(),
      const BookingHistory(),
      const ChatListScreen(),
      const ProfileScreen(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: _screens[_selectedIndex],
      bottomNavigationBar: SizedBox(
        height: 100, // Increase height of bottom container to allow more space for QR icon
        child: Stack(
          clipBehavior: Clip.none,  // Important to allow QR icon to overflow
          children: [
            // BottomNavigationBar
            Positioned.fill(
              child: Align(
                alignment: Alignment.bottomCenter,
                child: BottomNavigationBar(
                  backgroundColor: Colors.white,
                  type: BottomNavigationBarType.fixed,
                  selectedItemColor: AppColors.primary,
                  unselectedItemColor: Colors.black26,
                  selectedLabelStyle: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 15,
                  ),
                  iconSize: 28,
                  currentIndex: _selectedIndex,
                  onTap: (index) {
                    setState(() {
                      _selectedIndex = index;
                    });
                  },
                  items: const [
                    BottomNavigationBarItem(
                      icon: Icon(Icons.home_filled),
                      label: 'Home',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.book),
                      label: 'Bookings',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.chat),
                      label: 'Chat',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.account_circle),
                      label: 'Profile',
                    ),
                  ],
                ),
              ),
            ),
            // QR Icon positioned above the BottomNavigationBar
            Positioned(
              bottom: 40, // Adjust to lift the QR icon above the nav bar
              left: MediaQuery.of(context).size.width / 2 - 30, // Center horizontally
              child: GestureDetector(
                onTap: () {
  showModalBottomSheet(
    context: context,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
    ),
    builder: (context) {
      return Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Pay Remaining Amount',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              icon: const Icon(Icons.money),
              label: const Text('Pay by Cash'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 45),
              ),
              onPressed: () {
  Navigator.pop(context); // close bottom sheet
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => CashPaymentScreen(amount: remainingAmount),
    ),
  );
},
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              icon: const Icon(Icons.payment),
              label: const Text('Pay by eSewa'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 45),
                backgroundColor: Colors.teal,
              ),
              onPressed: () {
  Navigator.pop(context);

  // TODO: Replace with actual values fetched from backend or context
  String scd = 'EPAYTEST'; // Futsal owner's merchant code (get from DB if dynamic)
  String pid = 'booking123'; // e.g. booking ID or any unique transaction ID
  String amt = '500'; // remaining balance (get dynamically if possible)
  String paymentUrl = generateEsewaPaymentUrl(scd: scd, pid: pid, amt: amt);


  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (context) => EsewaQrCodeScreen(paymentUrl: paymentUrl),
    ),
  );
},
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            )
          ],
        ),
      );
    },
  );
},

                child: Container(
                  height: 60,
                  width: 60,
                  decoration: const BoxDecoration(
                    color: AppColors.primary, // Custom color
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.qr_code_2, // QR icon
                    color: Colors.white,
                    size: 30,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

//colours getting updated
//green is the color
