import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const EnderecoPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cpf, setCpf] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ttk_customer_address');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nome) setNome(parsed.nome);
        if (parsed.telefone) setTelefone(parsed.telefone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.cep) setCep(parsed.cep);
        if (parsed.estado) setEstado(parsed.estado);
        if (parsed.cidade) setCidade(parsed.cidade);
        if (parsed.bairro) setBairro(parsed.bairro);
        if (parsed.endereco) setEndereco(parsed.endereco);
        if (parsed.numero) setNumero(parsed.numero);
        if (parsed.complemento) setComplemento(parsed.complemento);
        if (parsed.cpf) setCpf(parsed.cpf);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCepLookup = async (value: string) => {
    const cleanCep = value.replace(/\D/g, '');
    setCep(value);
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setEstado(data.uf || '');
          setCidade(data.localidade || '');
          setBairro(data.bairro || '');
          setEndereco(data.logradouro || '');
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const handleSave = () => {
    if (!nome.trim() || !telefone.trim()) {
      addToast({ type: 'info', message: 'Por favor, preencha seu nome e telefone.' });
      return;
    }
    const fullStreet = `${endereco ? endereco + ', ' : ''}${numero ? numero + ', ' : ''}${bairro ? bairro + ', ' : ''}${cidade ? cidade + ', ' : ''}${estado ? estado : ''}${cep ? ' - ' + cep : ''}`;
    const addressObj = {
      nome,
      telefone,
      email,
      cep,
      estado,
      cidade,
      bairro,
      endereco,
      numero,
      complemento,
      cpf,
      formattedStreet: fullStreet
    };
    localStorage.setItem('ttk_customer_address', JSON.stringify(addressObj));
    addToast({ type: 'success', message: 'Endereço salvo com sucesso!' });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen w-full bg-[#e5e5e7] flex justify-center selection:bg-[#fe2c55]/20">
      <div className="relative min-h-screen w-full max-w-[440px] bg-[#f5f5f5] pb-[130px] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
        
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white border-b border-[#f0f0f0]">
          <div className="relative flex h-12 items-center px-2">
            <button 
              onClick={() => navigate(-1)}
              className="grid h-10 w-10 place-items-center text-[#161823] active:opacity-70"
              aria-label="Voltar"
            >
              <ChevronLeft className="h-6 w-6 text-[#161823]" />
            </button>
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#161823]">
              Adicionar o novo endereço
            </div>
          </div>
        </div>

        {/* Section: Informações de contato */}
        <div className="px-4 pb-2 pt-4 text-[13px] text-[#5a5b60]">
          Informações de contato
        </div>
        <div className="bg-white">
          <div className="px-4 border-b border-[#f0f0f0]">
            <input 
              type="text" 
              placeholder="Nome completo" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
          <div className="px-4 border-b border-[#f0f0f0]">
            <div className="flex items-center py-3.5">
              <span className="mr-2 text-[15px] text-[#161823]">BR</span>
              <span className="mr-2 text-[15px] text-[#161823]">+55</span>
              <span className="mr-3 h-4 w-px bg-[#e5e5e7]" />
              <input 
                type="text" 
                placeholder="Número de telefone" 
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
              />
            </div>
          </div>
          <div className="px-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
        </div>

        {/* Section: Informações de endereço */}
        <div className="px-4 pb-2 pt-4 text-[13px] text-[#5a5b60]">
          Informações de endereço
        </div>
        <div className="bg-white">
          <div className="px-4 border-b border-[#f0f0f0]">
            <input 
              type="text" 
              placeholder="CEP/Código postal" 
              value={cep}
              onChange={(e) => handleCepLookup(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
          <div className="grid grid-cols-2 border-b border-[#f0f0f0]">
            <div className="flex items-center justify-between px-4 py-3.5 text-left">
              <input
                type="text"
                placeholder="Estado/UF"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
              />
              <ChevronDown className="h-4 w-4 text-[#8a8b91] shrink-0 ml-1" />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 text-left border-l border-[#f0f0f0]">
              <input
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
              />
              <ChevronDown className="h-4 w-4 text-[#8a8b91] shrink-0 ml-1" />
            </div>
          </div>
          <div className="px-4 border-b border-[#f0f0f0]">
            <input 
              type="text" 
              placeholder="Bairro/Distrito" 
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
          <div className="px-4 border-b border-[#f0f0f0]">
            <input 
              type="text" 
              placeholder="Endereço" 
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
          <div className="px-4 border-b border-[#f0f0f0]">
            <input 
              type="text" 
              placeholder='Nº da residência. Use "s/n" se nenhum' 
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
          <div className="px-4">
            <input 
              type="text" 
              placeholder="Apartamento, bloco, unidade etc. (opcional)" 
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
        </div>

        {/* Section: Informações fiscais */}
        <div className="px-4 pb-2 pt-4 text-[13px] text-[#5a5b60]">
          Informações fiscais
        </div>
        <div className="bg-white">
          <div className="px-4">
            <input 
              type="text" 
              placeholder="CPF" 
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full bg-transparent py-3.5 text-[15px] outline-none placeholder:text-[#8a8b91] text-[#161823]"
            />
          </div>
        </div>
        <div className="bg-white px-4 pb-3 text-[12.5px] text-[#8a8b91]">
          O CPF será usado para emitir faturas.
        </div>

        {/* Section: Configurações */}
        <div className="px-4 pb-2 pt-4 text-[13px] text-[#5a5b60]">
          Configurações
        </div>
        <div className="bg-white">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-[15px] text-[#161823]">Definir como padrão</span>
            <button 
              onClick={() => setIsDefault(!isDefault)}
              className={`relative h-[26px] w-[46px] rounded-full transition ${isDefault ? 'bg-[#fe2c55]' : 'bg-[#e5e5e7]'}`}
            >
              <span className={`absolute top-[2px] h-[22px] w-[22px] rounded-full bg-white shadow transition-all ${isDefault ? 'right-[2px]' : 'left-[2px]'}`} />
            </button>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[440px] bg-white pt-2">
          <div className="px-6 pb-2 text-center text-[12px] leading-relaxed text-[#5a5b60]">
            Leia a <span className="font-semibold text-[#161823]">Política de privacidade do TikTok</span> para saber mais sobre como usamos suas informações pessoais.
          </div>
          <div className="px-4 pb-[max(env(safe-area-inset-bottom),12px)]">
            <button 
              onClick={handleSave}
              className="w-full rounded-full bg-[#fe2c55] py-3 text-[16px] font-semibold text-white transition hover:bg-[#e0264b] active:scale-[0.99]"
            >
              Salvar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default EnderecoPage;
