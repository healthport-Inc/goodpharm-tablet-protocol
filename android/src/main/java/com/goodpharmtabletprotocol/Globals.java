package com.goodpharmtabletprotocol;

import com.goodpharmtabletprotocol.VORepository.SocketVO;

import java.util.ArrayList;
import java.util.List;

public class Globals {
    public static List<SocketVO> socketVOList = new ArrayList<>();

    public static void onCloseClient(SocketVO socketVO) {
        try {
            socketVO.socketOut.close();
            socketVO.socketIn.close();
            socketVO.socket.close();
        } catch (Exception ec) {
        } finally {
            socketVOList.remove(socketVO);
        }
    }
}
