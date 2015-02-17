#!/bin/bash
green="\033[00;32m"
yellow="\033[00;33m"
white="\033[0m"
user=""
pass=""

echo -e "\n $green SCRIPT DI TEST SISTEMA DI LOGIN.. $white \n"
echo -e "Inserisci lo username (lasciare vuoto se predefinito):\n"
echo -e -n "Username[$yellow prova1 $white]: "
read inputUser
if [ "$inputUser" == "" ]; then
    user="prova1"
else
    user=$inputUser
fi

echo -e "\n"
echo -e "Inserisci la password (lasciare vuoto se predefinito):\n"
echo -e -n "Password[$yellow password $white]: "
read inputPass
if [ "$inputPass" == "" ]; then
    pass="password"
else
    pass=$inputPass
fi
echo -e "\n"

echo -e "Login con password non corretta: "
echo -e "$green"
curl -X POST -H "Content-Type: application/json" -d '{"username":"'$user'","password":"pasrd"}' -c "./cookie.txt" http://localhost:3000/api/v1/user/login
echo -e "\n $white"

echo -e "Login con user inesistente: "
echo -e "$green"
curl -X POST -H "Content-Type: application/json" -d '{"username":"pra1","password":"password"}' -c "./cookie.txt" http://localhost:3000/api/v1/user/login
echo -e "\n $white"

echo -e "Login eseguito correttamente: "
echo -e "$green"
curl -X POST -H "Content-Type: application/json" -d '{"username":"'$user'","password":"'$pass'"}' -c "./cookie.txt" http://localhost:3000/api/v1/user/login
echo -e "\n $white"

echo -e "Accesso ad una rotta protetta, con login eseguito correttamente: "
echo -e "$green"
curl -b ./cookie.txt http://localhost:3000/test
echo -e "\n $white"

echo -e "Login check, su utente correttamente loggato: "
echo -e "$green"
curl -X POST -b ./cookie.txt http://localhost:3000/api/v1/user/logincheck
echo -e "\n $white"

echo -e "Logout dell'utente: "
echo -e "$green"
curl -X POST -b ./cookie.txt http://localhost:3000/api/v1/user/logout
echo -e "\n $white"

rm cookie.txt
echo -e "Accesso ad una rotta protetta, senza essere loggati: "
echo -e "$green"
curl -b ./cookie.txt http://localhost:3000/test
echo -e "\n $white"

echo -e "Login check, su utente non loggato: "
echo -e "$green"
curl -X POST -b ./cookie.txt http://localhost:3000/api/v1/user/logincheck
echo -e "\n $white"