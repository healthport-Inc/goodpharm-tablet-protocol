package com.goodpharmtabletprotocol.VORepository;

import java.io.BufferedReader;
import java.io.PrintWriter;
import java.net.Socket;

public class SocketVO {

    public Socket socket;
    public BufferedReader socketIn;
    public PrintWriter socketOut;

    public SocketVO(Socket client, BufferedReader scanner, PrintWriter socketOut) {
        this.socket = client;
        this.socketIn = scanner;
        this.socketOut = socketOut;
    }

}
