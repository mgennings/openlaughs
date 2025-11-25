import { Fragment, useState, useCallback, useEffect } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { WhisperTranscriptionContent } from './WhisperTranscriptionContent';

const WhisperTranscriptionPage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                Upload audio files and transcribe them using OpenAI Whisper API
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                View History
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <WhisperTranscriptionContent />
      </Container>
    </Fragment>
  );
};

export { WhisperTranscriptionPage };
