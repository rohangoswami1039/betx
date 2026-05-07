import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

const PredictionNotification = ({ prediction, onClose }) => {
    const user = auth().currentUser;

    const handleResponse = async (action) => {
        try {
            // Save user response in Firestore
            await firestore().collection("user_responses").add({
                userId: user?.uid,
                predictionId: prediction.id,
                action,
                respondedAt: firestore.FieldValue.serverTimestamp(),
            });
            console.log(action, "In My use effect----Prdeiction--", prediction);
            
            if (action === "viewed" && prediction.link) {
                // Open Google Form
                Linking.openURL(prediction.link)
                    .catch((err) => console.error("Failed to open URL:", err))
                    .finally(() => onClose?.());
            } else {
                // For SKIP
                onClose?.();
            }
        } catch (error) {
            console.error("Error saving response:", error);
            onClose?.(); // ensure overlay closes even if Firestore fails
        }
    };

    console.log("PredictionNotification Rendered", prediction);
    return (
        <View style={styles.container}>
            <Image source={{ uri: prediction.image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{prediction.heading}</Text>
                <Text style={styles.subtitle}>{prediction.subtitle}</Text>
                <Text style={styles.description}>{prediction.description}</Text>

                {/* Changed button text */}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <TouchableOpacity
                        style={[styles.button, { marginRight: 5 }]} // small spacing between buttons
                        onPress={() => handleResponse("viewed")}
                    >
                        <Text style={styles.viewText}>Click here →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.buttonSkip, { marginLeft: 5 }]}
                        onPress={() => handleResponse("skipped")}
                    >
                        <Text style={styles.skipText}>SKIP</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
        overflow: "hidden",
        elevation: 5,
        width: "90%",
        alignSelf: "center",
    },
    image: {
        width: "100%",
        height: 150,
    },
    content: {
        padding: 20,
    },
    subtitle: {
        fontSize: 14,
        color: "#777",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
    },
    viewBtn: {
        backgroundColor: "#4e54c8",
        borderRadius: 30,
        paddingVertical: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    button: {
        flex: 1,
        backgroundColor: '#4e54c8c0',
        borderRadius: 30,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSkip: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#205dec',
    },
    viewText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipText: {
        color: '#205dec',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PredictionNotification;