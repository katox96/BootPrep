import Link from 'next/link';
import QuestionBank from '@/components/questionBank/questionBank';

export default function QuestionBankPage() {
  return (
    <>
        <Link href="/profile">
            <button className="border border-1 border-slate-400 px-1 bg-slate-200 m-2 rounded-lg">Back</button>
        </Link>
        <QuestionBank></QuestionBank>
    </>
  );
}