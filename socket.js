let isMcdDefined = false
document.addEventListener('mcdBridgeReady', () => isMcdDefined = true)

function gDO(event, data) {
    return JSON.stringify({
        eventName: event,
        data
    })
}

function loginUser() {
    return new Promise((res, rej) => {
        const user = mcd.bridge.message('user');
        let outData = {}
        user.send({ "promptlogin": true });

        user.on('data', function (data) {
            // myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('user_data', data))
            outData = data
        });
        user.on('error', function (error) {
            // myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('user_data', error))
            rej(error, outData)
        });
        user.on('done', function () {
            // myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('user_done'))
            res(outData)
        });
    })
}


async function activateOffer(itemId) {
    if (!myGameInstance)
        return console.error('myGameInstance isn\'t defined')
    if (!isMcdDefined)
        return myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('error', 'mcd isn\'t defined'))
    loginUser()
        .then(data => {
            myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('data', { u: data }))
            var offerActivation = mcd.bridge.message('offerActivation');
            offerActivation.send({
                'loyaltyId': 2149,
                'rewardId': itemId
            });
            offerActivation.on('data', (data) => {
                myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('data', data))
            });
            offerActivation.on('error', (error) => {
                myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('data', error))
            });
            offerActivation.on('done', () => {
                myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('done'))
            });
        }).catch(e => {
            myGameInstance.SendMessage('VoucherPanel', 'Callback', gDO('error', { u: e }))
        })
}
