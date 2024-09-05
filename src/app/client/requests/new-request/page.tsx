import { NewRequestContainer } from '@/src/containers/Requests/NewRequest/NewRequestContainer';
import { Container } from '@mui/material';

const NewRequest = () => {
  return (
    <Container component="main" maxWidth="xl">
      <NewRequestContainer />
    </Container>
  );
};

export default NewRequest;
