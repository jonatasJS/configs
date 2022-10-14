interface ITemplate {
  data: {
    [key: string]: FormDataEntryValue;
  };
  isWiFi: boolean;
}

export function generateTemplate({ data, isWiFi }: ITemplate) {
  console.log(data);
  if (!isWiFi) {
    return navigator.clipboard.writeText(`ONU CONFIGURADA COM SUCESSO
    
EQUIPAMENTO: ${data.equipment}
MAC: ${data.mac}
SINAL: ${data.signal}
OLT: ${data.olt}
PLACA: ${data.board}
PON: ${data.pon}
VLAN: ${data.vlan}
        
TESTE DE VELOCIDADE EM ANEXO
`);
  } else {
    return navigator.clipboard.writeText(`ONU CONFIGURADA COM SUCESSO

EQUIPAMENTO: ${data.equipment}
MAC: ${data.mac}
SINAL: ${data.signal}
OLT: ${data.olt}
PLACA: ${data.board}
PON: ${data.pon}
VLAN: ${data.vlan}
    
REDE WIRELESS:
    
REDE: ${data.name}
SENHA: ${data.password}
    
TESTE DE VELOCIDADE EM ANEXO
`);
  }
}
