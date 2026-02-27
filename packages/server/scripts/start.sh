read -p "HOST_DB: " host
shift

read -p "PORT_DB: " port
shift

read -p "DATABASE: " database
shift


if [ "$host" = "localhost" ];then
    mongodump -h ds149146.mlab.com:49146 -d recars_test -u public -p passPublic123 -o '/tmp'
    mongorestore -h "$host:$port" -d $database '/tmp/recars_test'
else
    read -s -p "USER: " user
    printf '\n'
    shift

    read -s -p "PASSWORD: " pass
    printf '\n'
    shift

    mongodump -h ds149146.mlab.com:49146 -d recars_test -u public -p passPublic123 -o '/tmp'
    mongorestore  -h "$host:$port" -d $database -u $user -p $pass '/tmp/recars_test'
fi

rm -rf '/tmp/recars_test'