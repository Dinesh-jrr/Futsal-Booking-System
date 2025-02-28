import 'package:esewa_flutter_sdk/esewa_flutter_sdk.dart';
import 'package:esewa_flutter_sdk/esewa_config.dart';
import 'package:esewa_flutter_sdk/esewa_payment_success_result.dart';
import 'package:flutter/material.dart';
import 'package:user/common/esewa.dart';
import 'package:esewa_flutter_sdk/esewa_payment.dart';

class Esewa {
  pay() {
    try {
      EsewaFlutterSdk.initPayment(
          esewaConfig: EsewaConfig(
            environment: Environment.test,
            clientId: kEsewaClientId,
            secretId: kEsewaSecretKey,
          ),
          esewaPayment: EsewaPayment(
              productId: "1d71jd81",
            productName: "Product One",
            productPrice: "20",
            callbackUrl: '',
          ),
          onPaymentSuccess: (EsewaPaymentSuccessResult result){
              debugPrint('SUCCESS');
              verify(result);
          },
          onPaymentFailure: (){
            debugPrint('FAILURE');
          },
          onPaymentCancellation: (){
            debugPrint('CANCEL');
          },
      );
    } catch (e) {
      debugPrint('EXCEPTION');
    }
  }
  verify(EsewaPaymentSuccessResult result){
    //TODO after scucess call this function to verify
  }
}
