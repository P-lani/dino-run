export const castHighScore = (uuid, payload) => {
    //최고점수도 검증 !?

    console.log(`${uuid} 유저가 기록갱신 `);
    return {
        status: 'success',
        message: ` 축하합니다 ! ${uuid} 유저가 최고 기록을 갱신했습니다. ${payload.totalScore}점 `,
        broadcast: true,
    };
};
