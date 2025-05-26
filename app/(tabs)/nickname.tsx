import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenContent } from '~/components/ScreenContent';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SignOutButton } from '~/components/SignOutButton'
import { Link } from 'expo-router'
import { GoogleSignInButton } from '~/components/GoogleSignInButton';
import { useState } from "react";
import { TextInput, Button, Text, ScrollView } from "react-native";
import { generateNicknames } from "../../lib/ollama";

export default function Nickname() {
    const { user } = useUser()
    const [prompt, setPrompt] = useState("");
    const [results, setResults] = useState<string[]>([]);

    const handleGenerate = async () => {
        console.log("Generating nicknames with prompt:", prompt);
        
        const names = await generateNicknames(prompt);
        setResults(names);
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Nickname' }} />
            <View style={styles.container}>
                {/* <ScreenContent path="app/(tabs)/profile.tsx" title="Profile" /> */}
                <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}!</Text>
                <SignOutButton />
                </SignedIn>
                <SignedOut>


                </SignedOut>
                {/* <ScrollView className="p-4"> */}
                    <TextInput
                        placeholder="Descrivi lo stile dei nickname"
                        value={prompt}
                        onChangeText={setPrompt}
                        className="border p-2 mb-2 rounded"
                    />
                    <Button title="Genera" onPress={handleGenerate} />
                    {results.map((name, index) => (
                        <Text key={index} className="mt-2 text-lg">
                            {name}
                        </Text>
                    ))}
                {/* </ScrollView> */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});
