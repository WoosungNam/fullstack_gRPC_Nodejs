const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./clientstreaming.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const clientstreamingproto = grpc.loadPackageDefinition(packageDefinition).clienttreaming;

function get_number(call, callback){
    console.log("Server processing gRPC client-streaming.");
    let count = 0;
    //client로 부터 data가 있다면 count++
    call.on('data', function(request){
        count++;
    })
    //끝났을 경우 count를 clinet에게 넘겨줌
    call.on('end',function(){
        callback(null,{value: count});
    })
}

function main(){
    var server = new grpc.Server();
    server.addService(clientstreamingproto.ClientStreaming.service, {GetServerResponse: get_number});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log("Starting server. Listening on port 50051.");
        server.start();
    });
}

main();