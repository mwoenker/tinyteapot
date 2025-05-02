import { Mesh } from "./mesh.js";
import { cubicPatchToMesh } from "./patch.js";
import { Vec3 } from "./vector.js";

// decodes string containing chars between space and ~, and returns array of
// numbers between 0 and 94
function decode(data: string): number[] {
  return data.split("").map((c) => c.charCodeAt(0) - 32);
}

function encode(data: number[]): string {
  return data.map((d) => String.fromCharCode(d + 32)).join("");
}

function undiff(start: number, diffs: number[]) {
  const result = [start];
  diffs.forEach((d, i) => {
    result.push(result[i] + d);
  });
  return result;
}

const teapotPointsFlat = decode(
  'C8AC2A>-A8-AC8BC2B>-B8-BD8BD2BD8AD1A?,A8,A2-A-2A-8A2-B-2B-8B1,A,1A,8A->A2CA8CA->B2CB8CB2DB8DB,?A1DA8DA>CAC>A>CBC>B>DBD>B?DAD?AF8=F0=@*=8*=H89H/9A(98(9H85H/5A(58(50*=*0=*8=/(9(/9(89/(5(/5(85*@=0F=8F=(A9/H98H9(A5/H58H5@F=F@=AH9HA9AH5HA5H82H/2A(28(2D80D10?,08,0D8/D1/?,/8,//(2(/2(821,0,10,801,/,1/,8/(A2/H28H2,?01D08D0,?/1D/8D/AH2HA2?D0D?0?D/D?/+8>+6>,6@,8@&8>&6>$6@$8@"8>"6> 6@ 8@"8<"6< 6< 8<,:@+:>$:@&:> :@":> :<":<"8;"6; 69 89$87$67#66#86(65)63)83 :9":;#:6$:7):3(:5F89F39F33F83M89M39Q35Q85J8?J6?K6>K8>N8AN6AR6AR8AF=3F=9Q=5M=9K:>J:?R:AN:AN8BN6BT6BT8BO8BO7BT7BN7AR7AT:BN:BT9BO9BR9AN9A88G>8G>4G<2G82G88E:8D:7D96D86D42G24G28G76D67D68D2<G4>G8>G69D7:D8:D<>G><G9:D:9D;8B;6B:5B85BB8BB2B>.B8.BB8AB2A>.A8.A65B56B58B2.B.2B.8B2.A.2A.8A5:B6;B8;B.>B2BB8BB.>A2BA8BA:;B;:B>BBB>B>BAB>A88.C8.C>.>C.8C.2C.->.-8.-2.2-.8-.>-.C2.',
).map((x) => x - 24);

const teapotPatchIndexValues = undiff(
  -174,
  decode('&,`)K""!!!""!!!$!""""!!!!!!!!""!!"!!!!!!!!!!!!!!!!"!!"!!!!.($=)X))'),
);

const teapotPatchIndexesFlat = undiff(
  0,
  decode(
    "AAAAAAAAA>ABAAA8JAA9IAA6IAA<FAA<FAA<FAA9FBA:HAA:HA(YGA*WGA+VFA+@AAAZAAAAAAAAAAA%FAAUHAA;GAA<FAA%HAAUFAA<FAA<FAA&FA+]FA+WEA,VDA.@AAAVAAAAAAAAAAA'FAARHAA;GAA<FAA'FAASFAA<FAA<FAA'DA.\\FA+WEA,VDA.YAAAAAAAAAAAAAAA6LA3FJA4FHA5FFA7@AAAHAAAAAAA$^AA2FA7NGA6FEA8EDA#_AAAAAAAAAAAAAAA6LA3FJA4FHA5FFA7@AAAHAAAAAA>4RA3@FA7NEA8BGA:5TA/X@@@AAAAA@@@AAAA9@@@CEAA;@@@CCAA4@@@KCAA5@@@ICAA1@@@QCA0C@@@OBA2@AAAPAAAAAAAAAAA-CAAMHAA;GAA<FAA+CAARFAA<FAA<FAA)BA2[FA+WEA,VDA.Y@@@AAAA X?=1X?=`@@@CAAA\"??;H??;a@@@FAAA!??;H??;b@@@IAA7!???B???",
  ).map((idx) => teapotPatchIndexValues[idx]),
);

const teapotPoints: Vec3[] = [];
teapotPointsFlat.forEach((n, i) => {
  if (i % 3 === 0) {
    teapotPoints.push([] as unknown as Vec3);
  }
  teapotPoints[(i / 3) | 0].push(n);
});
const teapotPatchIndexes: number[][][] = [];
teapotPatchIndexesFlat.forEach((n, i) => {
  if (i % 16 === 0) {
    teapotPatchIndexes.push([]);
  }
  if (i % 4 === 0) {
    teapotPatchIndexes[i >> 4].push([]);
  }
  teapotPatchIndexes[i >> 4][(i >> 2) & 3].push(n);
});

export function createTeapotMeshes(divisions: number): Mesh[] {
  return teapotPatchIndexes.map((controlPoints) =>
    cubicPatchToMesh(
      controlPoints.map((row) => row.map((idx) => teapotPoints[idx])),
      divisions,
      divisions,
    ),
  );
}
