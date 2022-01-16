import React from 'react';
import {
    chakra,
    Box,
    Flex,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverHeader,
    PopoverBody,
    PopoverCloseButton,
    Link,
    Text,
    Menu,
    MenuDivider,
    MenuButton,
    MenuOptionGroup,
    MenuItemOption,
    MenuList,
    useColorModeValue,
    VisuallyHidden,
    HStack,
    Button,
    useDisclosure,
    VStack,
    IconButton,
    CloseButton
} from '@chakra-ui/react';
import { ChevronDownIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { leaveRoom } from '../actions/roomActions';

const RoomNavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const participantJoin = useSelector((state) => state.participantJoin);
    const { participantInfo } = participantJoin;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const bg = useColorModeValue('white', 'gray.800');
    const mobileNav = useDisclosure();

    const handleLeaveRoom = (e) => {
        console.log('[RoomNavBar] handleLeaveRoom');
        e.preventDefault();
        dispatch(leaveRoom(participantInfo.roomID, participantInfo._id));
        if (userInfo) {
            console.log('\tredirecting to dashboard');
            navigate('/dashboard');
        } else {
            console.log('\tredirecting to root');
            navigate('/');
        }
    };

    const handleCopy = (e) => {
        console.log('[RoomNavBar] handleCopy');
        e.preventDefault();
        document.execCommand('');
    };

    return (
        <chakra.header
            borderBottom="1px"
            borderColor="black"
            bg={bg}
            w="full"
            px={{ base: 2, sm: 2 }}
            py={2}
            shadow="md">
            <Flex alignItems="center" justifyContent="space-between">
                <Flex>
                    <chakra.a href="/" title="FlowLab Room" display="flex" alignItems="center">
                        <VisuallyHidden>FlowLab</VisuallyHidden>
                    </chakra.a>
                    <chakra.h1 fontSize="xl" fontWeight="medium" ml="2">
                        FlowLab
                    </chakra.h1>
                </Flex>

                <HStack display="flex" alignItems="center" spacing={4}>
                    <Button
                        rightIcon={<SmallCloseIcon />}
                        size="sm"
                        bg="secondary"
                        color="white"
                        onClick={() => {}}>
                        <Text>Invite Link</Text>
                    </Button>
                    <Menu closeOnSelect={false}>
                        <MenuButton size="sm" as={Button} rightIcon={<ChevronDownIcon />}>
                            Settings
                        </MenuButton>
                        <MenuList minWidth="240px">
                            <MenuOptionGroup defaultValue="asc" title="Order" type="radio">
                                <MenuItemOption value="asc">option 1</MenuItemOption>
                                <MenuItemOption value="desc">option 2</MenuItemOption>
                            </MenuOptionGroup>
                            <MenuDivider />
                            <MenuOptionGroup title="Country" type="checkbox">
                                <MenuItemOption value="email">Video</MenuItemOption>
                                <MenuItemOption value="phone">Mute</MenuItemOption>
                                <MenuItemOption value="country">Sound</MenuItemOption>
                            </MenuOptionGroup>
                        </MenuList>
                    </Menu>
                    <Button
                        rightIcon={<SmallCloseIcon />}
                        size="sm"
                        bg="secondary"
                        color="white"
                        onClick={handleLeaveRoom}>
                        Leave
                    </Button>

                    <Box display={{ base: 'inline-flex', md: 'none' }}>
                        <IconButton
                            display={{ base: 'flex', md: 'none' }}
                            aria-label="Open menu"
                            fontSize="20px"
                            color={useColorModeValue('gray.800', 'inherit')}
                            variant="ghost"
                            onClick={mobileNav.onOpen}
                        />
                        <VStack
                            pos="absolute"
                            top={0}
                            left={0}
                            right={0}
                            display={mobileNav.isOpen ? 'flex' : 'none'}
                            flexDirection="column"
                            p={2}
                            pb={4}
                            m={2}
                            bg={bg}
                            spacing={3}
                            rounded="sm"
                            shadow="sm">
                            <CloseButton aria-label="Close menu" onClick={mobileNav.onClose} />
                            <Button width="full">Settings</Button>
                            <Button
                                width="full"
                                colorScheme="red"
                                borderRadius="0"
                                onClick={handleLeaveRoom}>
                                Leave
                            </Button>
                        </VStack>
                    </Box>
                </HStack>
            </Flex>
        </chakra.header>
    );
};

export default RoomNavBar;
