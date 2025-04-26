import EmptyScreenMessage from "@/components/common/EmptyScreenMessage";
import HistoryItem from "@/components/history/HistoryItem";
import { commonStyles } from "@/style/commonStyles";
import header from "@/hooks/common/header";
import queryHistory from "@/hooks/history/queryHistory";
import { FlatList, View } from "react-native";
import ScreenWrapper from "@/components/common/ScreenWrapper";

export default function HistoryScreen() {
  const { history, confirmDeleteHistory, confirmDeleteAll, search} = queryHistory();
  header({ confirmDeleteAll, search });

  return history && Object.keys(history).length > 0 ? (
    <ScreenWrapper style={commonStyles.scrollContainer}>
      <FlatList
        contentContainerStyle={commonStyles.flatList}
        data={Object.keys(history)}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => {
          return (
            <HistoryItem
              date={item}
              stories={history[item]}
              key={index}
              onDelete={confirmDeleteHistory}
            />
          );
        }}
      />
    </ScreenWrapper>
  ) : (
    <EmptyScreenMessage message="Nothing to show yet. Read something to see it here :D" />
  );
}
