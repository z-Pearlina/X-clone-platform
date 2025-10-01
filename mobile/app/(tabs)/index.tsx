import { View, Text } from 'react-native'
import React, { use } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import SignOutButton from '@/components/SignOutButton';
import { useUser } from '@clerk/clerk-expo';
import { useUserSync } from '@/hooks/useUserSync';

const HomeScreen = () => {
  useUserSync()
  return (
    <SafeAreaView className="flex-1">
      <Text>HomeScreen</Text>
      <SignOutButton />
    </SafeAreaView>
  )
}

export default HomeScreen;