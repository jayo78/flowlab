import React from 'react';
import { Box, CircularProgress, Text } from '@chakra-ui/react';

const Loading = () => {
    return (
        <Box position="relative" width="100%" height="400">
            <Box position="absolute" top="50%" left="50%">
                <CircularProgress isIndeterminate size="50px" color="primary" />
                <Text>Loading</Text>
            </Box>
        </Box>
    );
};

export default Loading;
