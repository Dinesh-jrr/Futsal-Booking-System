import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class EsewaQrCodeScreen extends StatelessWidget {
  final String paymentUrl;

  const EsewaQrCodeScreen({required this.paymentUrl, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pay via eSewa QR'),
        backgroundColor: Colors.green,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              QrImageView(
                data: paymentUrl,
                version: QrVersions.auto,
                size: 250.0,
              ),
              const SizedBox(height: 20),
              const Text(
                'Scan this QR code with your eSewa app\nto pay the remaining amount.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
