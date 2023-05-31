import { View, Text } from 'react-native'
import React from 'react'
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";


const checkAndIssueAlerts = () => {
const rules = [
  {
    component: 'Diet',
    maxReportsLastWeek: 3,
  },
  {
    component: 'friendStatus',
    minReports: 2,
  },
  {
    component: 'Mood',
    lessReportsThanPrevious: true,
  },
];

async function checkAndIssueAlerts() {
  try {
    for (const rule of rules) {
      const { component, maxReportsLastWeek, minReports, lessReportsThanPrevious } = rule;

    
      const collectionRef = db.collection(component);

      // Query to retrieve reports based on the required time period
      const lastWeekStart = new Date();
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);

      const query = collectionRef
        .where('date', '>=', lastWeekStart)
        .orderBy('date', 'desc')
        .limit(maxReportsLastWeek || 2); // Limit to the required number of reports

      const snapshot = await query.get();
      const reportsCount = snapshot.size;

      // Check if the rule is violated and issue an alert
      if (maxReportsLastWeek && reportsCount > maxReportsLastWeek) {
        // Issue an alert using your preferred method (e.g., show a notification, display an in-app message)
        console.log(`Alert: You have violated the rule in ${component}. More than ${maxReportsLastWeek} reports in the last week.`);
      }

      if (minReports && reportsCount < minReports) {
        console.log(`Alert: You have violated the rule in ${component}. Less than ${minReports} reports.`);
      }

      if (lessReportsThanPrevious && reportsCount > 0) {
        const previousSnapshot = await query.offset(1).get();
        const previousReportsCount = previousSnapshot.size;

        if (reportsCount < previousReportsCount) {
          console.log(`Alert: You have violated the rule in ${component}. There is one less report compared to the previous time period.`);
        }
      }
    }
  } catch (error) {
    console.error('Error checking and issuing alerts:', error);
  }
}

  return (
    <View>
      <Text>checkAndIssueAlerts</Text>
    </View>
  )
}

export default checkAndIssueAlerts