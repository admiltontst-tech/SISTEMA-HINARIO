-- Hinário: tabela de sincronização
-- Cole tudo isto em Supabase > SQL Editor > New query e clique em "Run".

create table if not exists public.hinario_itens (
  user_id         uuid        not null default auth.uid() references auth.users on delete cascade,
  id              text        not null,
  dados           jsonb,
  apagado         boolean     not null default false,
  editado_em      timestamptz not null,
  sincronizado_em timestamptz not null default clock_timestamp(),
  primary key (user_id, id)
);

create index if not exists hinario_itens_sync_idx
  on public.hinario_itens (user_id, sincronizado_em);

-- Marca a hora em que o servidor recebeu a alteração
-- e nunca deixa uma versão mais antiga sobrescrever uma mais nova.
create or replace function public.hinario_itens_carimbo()
returns trigger language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.editado_em < old.editado_em then
    return old;
  end if;
  new.sincronizado_em := clock_timestamp();
  return new;
end $$;

drop trigger if exists hinario_itens_carimbo on public.hinario_itens;
create trigger hinario_itens_carimbo
  before insert or update on public.hinario_itens
  for each row execute function public.hinario_itens_carimbo();

-- Segurança: cada pessoa só enxerga e altera os próprios hinos
alter table public.hinario_itens enable row level security;

drop policy if exists "ler os meus"      on public.hinario_itens;
drop policy if exists "criar os meus"    on public.hinario_itens;
drop policy if exists "alterar os meus"  on public.hinario_itens;
drop policy if exists "apagar os meus"   on public.hinario_itens;

create policy "ler os meus"     on public.hinario_itens for select to authenticated using (user_id = auth.uid());
create policy "criar os meus"   on public.hinario_itens for insert to authenticated with check (user_id = auth.uid());
create policy "alterar os meus" on public.hinario_itens for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "apagar os meus"  on public.hinario_itens for delete to authenticated using (user_id = auth.uid());
