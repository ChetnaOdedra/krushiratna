// components/OtpInput.js
import React, { useRef, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import IMAGES from "../Util/Images";
import { t } from "i18next";

const OtpInput = ({
  otp,
  setOtp,
  title,
  onBack,
  onSubmit,
  onResend,
  backText = "પાછળ",
  submitText = "સબમિટ",
  mobileNumber = ""
}) => {
  const inputsRef = useRef([]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes = 120 seconds

  // timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // format mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60));
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOtpChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const otpValue = otp.join("").trim();
    if (otpValue.length !== otp.length) {
      setError("કૃપા કરીને તમામ OTP અંકો દાખલ કરો");
      return;
    }
    setError("");
    onSubmit?.(otpValue);
  };

  const handleResend = () => {
    setTimeLeft(120);
    onResend?.();
  };

  return (
    <View style={{ flex: 1, padding: 0 }}>
      {/* OTP Boxes */}
        <Text style={styles.titleview}>
                      {`+91 ${mobileNumber} ${t('Code sent to')}`}
        </Text>
       <Text style={styles.titleview}>ઓટીપી દાખલ કરો</Text>
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputsRef.current[index] = ref)}
            value={digit || ""}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{error}</Text>
      ) : null}

      {/* Resend OTP / Timer */}
      {onResend && (
        <View style={{ marginTop: 15, alignItems: "center" }}>
          {timeLeft > 0 ? (
            <Text style={{ color: "#666", fontSize: 14 ,marginTop: -5 }}>
              બાકી સમય :{" "}
              <Text style={{ color: "#1E7B35", fontWeight: "700" }}>
                {formatTime(timeLeft)}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={{ textAlign: "center", color: "#1E7B35", textDecorationLine: "underline",marginTop: 10 }}>
                કોડ મળ્યો નથી? ફરીથી મોકલો
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30 }}>
        {onBack && (
          <TouchableOpacity style={styles.secondaryBtn} onPress={onBack}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={IMAGES.Left} style={{ width: 18, height: 18, marginRight: 8 ,marginTop: 2}} />
              <Text style={styles.secondaryBtnText}>{backText}</Text>
            </View>
          </TouchableOpacity>
        )}
        {onSubmit && (
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
            <Text style={{ color: "#fff", fontSize: 16 }}>{submitText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ marginBottom: 5 }}></View>
    </View>
  );
};

export default OtpInput;

const styles = StyleSheet.create({
  otpBox: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#1E7B35",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    left: -6,
    bottom: -10,
  },
  secondaryBtnText: {
    color: "#1B5E20",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryBtn: {
    backgroundColor: "#1E7B35",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    right: -6,
    bottom: -10,
  },
   titleview: {
    color: "#000000ff",
    fontSize: 14,
    marginTop: 20,
    // fontWeight: "700",
    textAlign:'center'
  },
});
