'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BlueprintStudio from './BlueprintStudio';
import Header from '../../../../../components/cms/Header';
import Footer from '../../../../../components/cms/Footer';


export default function Home() {
  const router = useRouter();
  
  return (
    <><Header onLogout={() => router.push('/dashboard/cms/login')} />
    <BlueprintStudio />
    <Footer/>
    </>);
}