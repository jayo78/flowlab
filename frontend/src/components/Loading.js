import React from 'react';
import { Box, CircularProgress, Text } from '@chakra-ui/react';

const Loading = () => {
    return (
        <Box>
            <CircularProgress isIndeterminate size="50px" color="primary" />
            <Text>Loading</Text>
        </Box>
    );
};

export default Loading;
