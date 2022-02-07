import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@chakra-ui/react';
import Card from './Card';

const CardGallery = ({ participants }) => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        console.log('[CardGallery] mount');
        console.log(participants);

        //
        // only push 4 cards, if num participants < 4 then rest of cards are null
        let j = 0;
        let tmpCards = [];
        for (let i = 0; i < 4; i++)
            participants[j] ? tmpCards.push(participants[j++]) : tmpCards.push(null);
        setCards(tmpCards);
    }, [participants]);

    return (
        <Grid
            row="auto auto"
            templateColumns="340px 340px"
            templateRows={{
                base: '150px 150px',
                md: '250px 250px',
                lg: '300px 300px'
            }}
            gap="20px"
            justifyContent="center">
            {cards.map((cardInfo, i) => {
                if (cardInfo !== null) {
                    return (
                        <Box
                            key={i}
                            boxShadow="lg"
                            borderRadius={15}
                            display="flex"
                            backgroundColor="white">
                            <Card participant={cardInfo} />
                        </Box>
                    );
                } else {
                    // null card
                    return (
                        <Box
                            key={i}
                            boxShadow="lg"
                            borderRadius={15}
                            display="flex"
                            backgroundColor="#E5E5E5">
                            <Card />
                        </Box>
                    );
                }
            })}
        </Grid>
    );
};

export default CardGallery;
