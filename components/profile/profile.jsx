import Link from 'next/link';
import { WelcomeCard } from "./welcomeCard";
import { TestSeriesTable } from "./testSeriesTable";
import { signOut } from 'next-auth/react';
import SubscriptionBox from './subscriptionBox';
import QuestionBank from '../questionBank/questionBank';
import PreviousYearTable from './previousYearTable';
import { PracticeTestTable } from './practiceTestTable';
import { Header } from './header';

const Profile = ({ profileProps }) => {
    const name = profileProps.name;
    const submittedTests = profileProps.subscriptionInfo.submittedTests;
    const ongoingTests= profileProps.subscriptionInfo.ongoingTests;
    const tests = profileProps.subscriptionInfo.tests;
    const testsCount = profileProps.subscriptionInfo.testsCount;
    const subscriptionStatus = profileProps.subscriptionStatus;

    // if(subscriptionStatus){

        const testsTableProps = {
            submittedTests: submittedTests,
            ongoingTests: ongoingTests,
            tests: tests,
            testsCount: testsCount
        }

    //     return (
    //         <>
    //             <TestSeriesTable data={ testSeriesTableProps }></TestSeriesTable>
    //             <PreviousYearTable></PreviousYearTable>
    //             <PracticeTestTable></PracticeTestTable>
    //             <QuestionBank></QuestionBank>
    //         </>
    //     );
    // }else{

    //     return (
    //         <>
    //             <SubscriptionBox></SubscriptionBox>
    //             <PreviousYearTable></PreviousYearTable>
    //             <PracticeTestTable></PracticeTestTable>
    //             <QuestionBank></QuestionBank>
    //         </>
    //     );
    // }
    return (
        <>
            <PreviousYearTable data={ testsTableProps }></PreviousYearTable>
            <TestSeriesTable data={ testsTableProps }></TestSeriesTable>
            <PracticeTestTable data={ testsTableProps }></PracticeTestTable>
            <QuestionBank></QuestionBank>
        </>
    );
}

export default Profile;