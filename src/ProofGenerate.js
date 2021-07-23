
const axios = require('axios');
const bulletproofs = require('bulletproof-js');
const {ec} =  require('elliptic');
const cryptoutils = require('bigint-crypto-utils');
const csvjson = require('csvjson');
const fs = require('fs');
const path = require('path');
const { SSL_OP_NO_TLSv1_2 } = require('constants');


function sendProof(userId, proofdata){
  axios.post('http://164.125.68.145:10051', {
    Id : "userId",
    data : "proofdata"
  })
  .then((res) => {
    console.log(res.body);
    return res; // or response
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
}

function calculate_xy(array) {
  let arrdata = [];

  arrdata.push([array[0] * -0.10485934466123581, array[0] * 0.031075719743967056])
  arrdata.push([array[1] * -0.07049593329429626, array[1] * -0.019336290657520294])
  arrdata.push([array[2] * -0.0050347186625003815, array[2] * 0.045631419867277145])
  arrdata.push([array[3] * -0.15843532979488373, array[3] * 0.0015267892740666866])
  arrdata.push([array[4] * -0.006724816281348467, array[4] * 0.007269535679370165])
  arrdata.push([array[5] * -0.006583088543266058, array[5] * -0.0014202318852767348])
  arrdata.push([array[6] * -0.014175831340253353, array[6] * -0.010515422560274601])
  arrdata.push([array[7] * -0.06385926157236099, array[7] * 0.14427757263183594])
  arrdata.push([array[8] *  0.027269847691059113, array[8] * 0.0072233229875564575])
  arrdata.push([array[9] * 0.003165904199704528, array[9] * -0.021378211677074432])
  arrdata.push([array[10] * 0.006797333713620901, array[10] * 0.0032920956145972013])
  arrdata.push([array[11] * 0.04430394247174263, array[11] * -0.02787671983242035])
  arrdata.push([array[12] * -0.020241878926753998, array[12] * -0.13840056955814362])
  arrdata.push([array[13] * 0.09291474521160126, array[13] * 0.05037221312522888])
  arrdata.push([array[14] * 0.07133547216653824, array[14] * 0.0286816768348217])
  let arr_res=[0.0, 0.0];
  for(let i=0; i<15; ++i){
    arr_res[0] += arrdata[i][0];
    arr_res[1] += arrdata[i][1];
  }

  arr_res[0] += -0.04596012085676193;
  arr_res[1] += 1.30573308467865;
  
  return arr_res;
}

function readCSV(){
  const data = fs.readFileSync(path.join(__dirname, '.', 'data', 'test_onlyvalue.csv'), { encoding : 'utf8'});
  const options = {
    delimiter : ',', // optional
    quote     : '' // optional
  };
  const array_csv = csvjson.toArray(data, options);
  for(let i=0, len=array_csv.length; i<len; i++){
    array_csv[i] = array_csv[i].map(str=>Number(str)) 
  }
  
  // array slice to index & value
  let real_location = [];
  let apvalue = [];
  let obs_location = [];
  for(let i=0, len=array_csv.length; i<len; i++){
    real_location[i] = array_csv[i].slice(0,2);
    apvalue[i] = array_csv[i].slice(2);
    obs_location[i] = calculate_xy(apvalue[i]);
  }
  console.log(obs_location);
  return obs_location;
}

// example
// proof = getProof(x, y);
// if(proof) sendProof(userId, proof);

function getProof(x, y){
  if(x >= 2 && x <= 5 && y <= 1 && y >= -2){
    return gridToProof(((y+2)*4+(x-2)+1).n);
  }
  else
    return 0;
}

function locationTest(){
  for(let j=-2; j<=1; ++j){
    for(let i=2; i<=5; ++i){
      console.log((j+2)*4+(i-2)+1);
    }
  }
}
function gridToProof(data){ // 인자로 격자점 넘겨받기
  const ProofFactory = bulletproofs.ProofFactory;
  const ProofUtils = bulletproofs.ProofUtils;
  const secp256k1 = bulletproofs.Constants.secp256k1;
  const EC = new ec('secp256k1');
  
  console.log(typeof(secp256k1.n));
  // Random blinding factor
  const x = cryptoutils.randBetween(secp256k1.n);
  
  // Amount to which we commit
  const a = data;
  
  // Lower and upper bound of range proof (this will be treated as exponents of 2)
  const low = 0n;
  const upper = 4n;
  
  // Generator
  const G = EC.g;
  // Orthogonal Generator
  const H = ProofUtils.getnewGenFromHashingGen(G);
  // Pedersen Commitment to our amount
  const V = ProofUtils.getPedersenCommitment(a, x, secp256k1.n, H);
  
  // Compute an uncompressed proof first. Note the last parameter will switch off asserts improving performance
  const uncompr_proof = ProofFactory.computeBulletproof(a, x, V, G, H, low, upper, secp256k1.n, false);
  // Compress proof using the inner product protocol (Again pass false to switch off asserts)
  const compr_proof = uncompr_proof.compressProof(false);

  return compr_proof.toJson(true);
}
// readCSV();
// sendProof();
locationTest();