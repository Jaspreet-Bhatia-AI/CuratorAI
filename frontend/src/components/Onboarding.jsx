import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const { user } = useAuth();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const hasSeenLoginTour = localStorage.getItem('tour_login_seen');
    const hasSeenMainTour = localStorage.getItem('tour_main_seen');

    if (!user && !hasSeenLoginTour) {
      // Tour Part 1: Force them to login
      setSteps([
        {
          target: '#tour-login',
          content: 'Welcome to Curator AI! 👋 Let’s start by logging in to claim your 5 free AI generation credits.',
          placement: 'bottom',
          disableBeacon: true,
        }
      ]);
      setRun(true);
    } 
    else if (user && !hasSeenMainTour) {
      // Tour Part 2: Explain the app after login
      setTimeout(() => {
        setSteps([
          {
            target: '#tour-search',
            content: 'Type anything here! "Complete Python Roadmap", "Top 100 90s Hits", or "Chill Study Beats".',
            placement: 'bottom',
            disableBeacon: true,
          },
          {
            target: '#tour-roadmap',
            content: 'AI will generate a structured syllabus here. Click on any topic to filter the videos!',
            placement: 'right',
          },
          {
            target: '#tour-download',
            content: 'Click here to instantly compress all your selected videos into a single ZIP file.',
            placement: 'top',
          },
          {
            target: '#tour-library',
            content: 'Your downloaded songs stay here forever! Play them offline like a native music app.',
            placement: 'bottom',
          }
        ]);
        setRun(true);
      }, 1000); // Wait for UI to render
    }
  }, [user]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      if (!user) {
        localStorage.setItem('tour_login_seen', 'true');
      } else {
        localStorage.setItem('tour_main_seen', 'true');
      }
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          arrowColor: '#1e293b',
          backgroundColor: '#1e293b',
          overlayColor: 'rgba(0, 0, 0, 0.7)',
          primaryColor: '#8b5cf6', // google-purple
          textColor: '#f8fafc',
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: 'left'
        },
        buttonNext: {
          backgroundColor: '#8b5cf6',
          borderRadius: '8px',
        },
        buttonBack: {
          color: '#94a3b8'
        }
      }}
    />
  );
}
