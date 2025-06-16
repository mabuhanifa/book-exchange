export default function TransactionDetailsPage({
  params,
}: {
  params: { transactionType: string; transactionId: string };
}) {
  return (
    <div>
      <h1>
        Transaction Details for Type: {params.transactionType}, ID:{" "}
        {params.transactionId}
      </h1>
      {/* Transaction details will go here */}
    </div>
  );
}
