import yaml

with open('pnpm-lock.yaml', 'r', encoding='utf8') as f:
    data = yaml.safe_load(f)

for importer, deps in data.get('importers', {}).items():
    if importer.endswith('apps/web'):
        print(importer)
        print(deps.get('dependencies', {}))
        break
