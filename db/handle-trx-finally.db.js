async function handleTrxFinally(trx) {
    if (!trx.isCompleted()) {
        await trx.commit();
    }
}

export { handleTrxFinally };
