'use client'

import { useState } from 'react'
import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

import ETAPredictPage from '../app/eta/page'
import VariantPage from '../app/variant/page'
import VisualSimilarityPage from '../app/vss/page'

const MotionBox = motion(Box)

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'eta':
        return <ETAPredictPage />
      case 'variant':
        return <VariantPage />
      case 'vss':
        return <VisualSimilarityPage />
      case 'fraud':
        return (
          <Box p={6}>
            <Heading size="lg" color="red.500" mb={2}>🚨 Fraud Detection</Heading>
            <Text color="gray.700">Coming soon...</Text>
          </Box>
        )
      default:
        return (
          <Box textAlign="center" p={10}>
            <Heading size="xl" color="blue.700" mb={4}>🧠 AI Playground</Heading>
            <Text fontSize="lg" color="gray.600">
              Explore AI-powered tools for real-time e-commerce intelligence.
            </Text>
          </Box>
        )
    }
  }

  return (
    <Flex h="100vh" direction="column">
      {/* Header */}
      <Box bg="white" px={8} py={4} shadow="sm" borderBottom="1px" borderColor="gray.200">
        <Heading size="lg" color="purple.700">🚀 RBM AI Playground</Heading>
        <Text fontSize="sm" color="gray.500">Your real-time AI experiments dashboard</Text>
      </Box>

      {/* Main Section */}
      <Flex flex="1">
        {/* Sidebar */}
        <Box w="260px" bg="gray.50" p={6} borderRight="1px solid #e2e8f0" shadow="md">
          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold" fontSize="md" color="gray.600">🧪 AI Demos</Text>
            <Button
              variant={activeTab === 'eta' ? 'solid' : 'ghost'}
              colorScheme="blue"
              onClick={() => setActiveTab('eta')}
            >
              🚚 ETA Prediction
            </Button>
            <Button
              variant={activeTab === 'variant' ? 'solid' : 'ghost'}
              colorScheme="pink"
              onClick={() => setActiveTab('variant')}
            >
              🍉 Variant Assignment
            </Button>
            <Button
              variant={activeTab === 'vss' ? 'solid' : 'ghost'}
              colorScheme="green"
              onClick={() => setActiveTab('vss')}
            >
              🖼️ Visual Similarity
            </Button>
            <Button
              variant={activeTab === 'fraud' ? 'solid' : 'ghost'}
              colorScheme="orange"
              onClick={() => setActiveTab('fraud')}
            >
              🔐 Fraud Detection
            </Button>
          </VStack>
        </Box>

        {/* Right Panel */}
        <Box flex="1" p={8} bg="gray.100" overflowY="auto">
          <AnimatePresence mode="wait">
            <MotionBox
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </MotionBox>
        </AnimatePresence>
        </Box>
      </Flex>

      {/* Footer */}
      <Box bg="white" py={3} textAlign="center" fontSize="sm" borderTop="1px" borderColor="gray.200">
        © 2025 RBM Playground • All Rights Reserved....
      </Box>
    </Flex>
  )
}
