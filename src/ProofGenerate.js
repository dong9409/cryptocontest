const axios = require('axios');
const bulletproofs = require('bulletproof-js');
const {ec} =  require('elliptic');
const cryptoutils = require('bigint-crypto-utils');
const csvjson = require('csvjson');
const fs = require('fs');
const path = require('path');
const { SSL_OP_NO_TLSv1_2 } = require('constants');
const { normalize } = require('path');


export function calculate_xy(array) {
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

let real_location = []
let apvalue = []
let obs_location = []


export function readCSV(){
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
  for(let i=0, len=array_csv.length; i<len; i++){
    real_location[i] = array_csv[i].slice(0,2);
    apvalue[i] = array_csv[i].slice(2);
    obs_location[i] = calculate_xy(apvalue[i]);
  }
  console.log(obs_location);
  console.log(apvalue)
  return obs_location;
}

const invalidproof = "{\n  \"V\": \"040bed852536d5b94a051aa0735ac9235cc7361ef1c223658e36b0eaa3c976077e8d361c8ca54cef3a2a6d0275a9af99f58ee4c0c4d190b9000cebc14b74a47c85\",\n  \"A\": \"04ba93bd3cbac0a4b4029a60dd7ff187292b176b5fa805a640c4845ddd01fb254734799049a183973e0e40d5ff5fb4e4c71dab18e0106f914375d67ca20d4f087c\",\n  \"S\": \"0488667681474213b6d4098a2aeca7bee0fc50e1b62916fa6a45ba716a1722919b2e45e445b103429e493cad7cae8c88c805b3a3aa2918926d93b78db32cafbdb6\",\n  \"T1\": \"04d9154d29f2fac744b9f3e072b3c154c028036a643e4b0d5ff530bf10f798997f0ce08d13cdab6ff39192e23ed0ee2c013891a4f577b460aa1aea01de70548297\",\n  \"T2\": \"04b2b98f64a005f0e5c351b388cb9c9ecbeeaeb80bc8963f15007b1175d0d76d36afd0f967e3fc6fa009ca00ad3f20a58e998237ec13ba5ed20599eb14c433d32b\",\n  \"tx\": \"0xb34a25fac38a69e6247c4c3299815745cad21dd1bea632448971fc0cbbbc5a99\",\n  \"txbf\": \"0x4aedbd64c799e0197711e7193032532105ae4135bfc265265d96a4cc85a9fbd7\",\n  \"e\": \"0x694ffcd3bdc5aa410241a3794887e04d748ec00507a7337b872db8f6462fc392\",\n  \"a0\": \"0x61c87363248eeea04fade326ca01ec307092c057a12af94b279ab7891c6b9aef\",\n  \"b0\": \"0x92bc2590180ba8805c614dd1790d24ea7e3bc71fb4d02889d970e4852a373402\",\n  \"ind\": [\n    {\n      \"L\": \"04301919a10233ed524d123fb93aecabb2810b8c6c35c9b5095f5fc965da19d3344260fb1e67360b2ec5fff8fc9bd1a77a807f13fdd75928e0de7bd84d60fee88c\",\n      \"R\": \"04aa31ef7b5d67bd05ecda0c1000b8880c63c5064a3e67b9c96000844b7b6db31d44d1b5937b4248141d1453fbcee8af4e8532250088afac02698b7f9ece84211b\"\n    },\n    {\n      \"L\": \"0447fadfcc1e54173bd58d7f60cacaaa21bc38554ed1e1bb1392f39c9a8c0bf3f875479f2b010eb46039ccc90a8e403253aaee6399a4fe2abd96c8b746374fe0e0\",\n      \"R\": \"04292376e7751d4e2454d19e56020ceba434edcc79f21c6839c263d64c1afb003929922d6a0b15d19c2d0a9a5273704970b35dd22cabfc13797aeb6a7660f96512\"\n    }\n  ],\n  \"G\": \"0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8\",\n  \"order\": \"0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141\"\n}";


export function getProof(x, y){
  if(x >= 2 && x <= 5 && y <= 1 && y >= -2){
    return gridToProof(3n);
  }
  else
    return invalidproof;
}

export function gridToProof(data){ // 인자로 격자점 넘겨받기
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
  // console.log(compr_proof);
}
// getProof(3,0)
// sendProof("kim", getproof(3,0));
// locationTest();