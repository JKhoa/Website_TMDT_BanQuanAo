const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk('./src/app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('react-router')) {
        changed = true;
        
        // Match import lines
        content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]react-router['"];?/g, (match, p1) => {
            const imports = p1.split(',').map(s => s.trim());
            
            let nextImports = [];
            if (imports.includes('Link')) nextImports.push(`import Link from 'next/link';`);
            if (imports.includes('useParams') || imports.includes('useNavigate') || imports.includes('useLocation')) {
                let navImports = [];
                if (imports.includes('useParams')) navImports.push('useParams');
                if (imports.includes('useNavigate')) navImports.push('useRouter');
                if (imports.includes('useLocation')) navImports.push('usePathname');
                nextImports.push(`import { ${navImports.join(', ')} } from 'next/navigation';`);
            }
            
            return nextImports.join('\n');
        });

        if (file.includes('AdminLayout')) {
            content = content.replace('export function AdminLayout()', 'export default function AdminLayout({children})');
            content = content.replace('<Outlet />', '{children}');
        }
        
        content = content.replace(/const navigate = useNavigate\(\);?/g, 'const router = useRouter();\n  const navigate = router.push;');
        content = content.replace(/const location = useLocation\(\);?/g, 'const pathname = usePathname();\n  const location = { pathname };');
    }
    
    if (content.includes('<Link ')) {
        changed = true;
        content = content.replace(/<Link([^>]*?)to=/g, '<Link$1href=');
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
console.log('Migration complete');
