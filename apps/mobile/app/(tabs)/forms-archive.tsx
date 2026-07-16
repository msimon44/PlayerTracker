import { FlatList, StyleSheet, Text, View } from 'react-native';
import FormLinkCard from '../../components/ui/FormListCard';

const mockData: CardItemData[] = [
    {
        id: 1,
        title: 'Morning training session',
        date: '10/12/2025',
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Hulk_Hogan%2C_1985.jpg',
    },
    {
        id: 2,
        title: 'Evening review',
        date: '10/12/2025',
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Hulk_Hogan%2C_1985.jpg',
    },
    {
        id: 3,
        title: 'Weekly sync',
        date: '11/12/2025',
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Hulk_Hogan%2C_1985.jpg',
    },
];

export interface CardItemData {
    id: string | number;
    title: string;
    date: string;
    iconUrl: string;
}

interface CardListProps {
    data: CardItemData[];
    onCardPress: (id: string | number) => void;
}

const CardList: React.FC<CardListProps> = ({ data, onCardPress }) => {
    const renderItem = ({ item }: { item: CardItemData }) => (
        <FormLinkCard
            id={item.id}
            title={item.title}
            date={item.date}
            iconUrl={item.iconUrl}
            onPress={onCardPress}
            isArchived={true}
        />
    );

    return (
        <View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default function ActiveFormsScreen() {
    const handlePress = (id: string | number) => {
        console.log(`Clicked item ${id}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleContainer}>Forms Archive</Text>
            <CardList data={mockData} onCardPress={handlePress} />
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    container: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    listContent: {
        paddingVertical: 8, // Adds padding at the very top and bottom of the list
    },
});
